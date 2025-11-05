// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const xml2js = require('xml2js');
const pool = require('./db'); // 👈 Conexión a PostgreSQL

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Uploads
const upload = multer({ dest: 'uploads/' });

// Rutas

// Registro de usuario
app.post('/api/users', async (req, res) => {
  const { email, password, name } = req.body;

  // Validar dominio
  if (!email.endsWith('@gmail.com') && !email.endsWith('@outlook.com')) {
    return res.status(400).json({ error: 'Solo se permiten @gmail.com o @outlook.com' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, password]
    );
    res.json({ message: 'Usuario creado', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Inicio de sesión
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.json({ token: 'fake-jwt-token', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Reservar asiento
app.post('/api/reservations', async (req, res) => {
  const { seat_number, passenger_name, cui, has_luggage, user_email, class_type, selection_method } = req.body;

  // Validar CUI (13 dígitos)
  if (cui.length !== 13 || !/^\d+$/.test(cui)) {
    return res.status(400).json({ error: 'CUI inválido' });
  }

  // Calcular precio
  let price = class_type === 'business' ? 500 : 200;

  // Verificar si es VIP (más de 5 reservas)
  const userReservations = await pool.query(
    'SELECT COUNT(*) FROM reservations WHERE user_email = $1',
    [user_email]
  );

  if (parseInt(userReservations.rows[0].count) > 5) {
    price *= 0.9; // 10% de descuento
  }

  try {
    const result = await pool.query(
      `INSERT INTO reservations (
        seat_number, passenger_name, cui, has_luggage, user_email, 
        class_type, selection_method, price
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [seat_number, passenger_name, cui, has_luggage, user_email, class_type, selection_method, price]
    );

    res.json({ message: 'Reserva creada', reservation: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
});

// Modificar reserva
app.put('/api/reservations/:id', async (req, res) => {
  const { id } = req.params;
  const { new_seat_number, cui } = req.body;

  try {
    // Verificar que el CUI coincida
    const reservation = await pool.query(
      'SELECT * FROM reservations WHERE id = $1 AND cui = $2',
      [id, cui]
    );

    if (reservation.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada o CUI incorrecto' });
    }

    // Aplicar penalización del 10%
    const oldPrice = reservation.rows[0].price;
    const newPrice = oldPrice * 1.1;

    const result = await pool.query(
      'UPDATE reservations SET seat_number = $1, price = $2, is_modified = true WHERE id = $3 RETURNING *',
      [new_seat_number, newPrice, id]
    );

    res.json({ message: 'Reserva modificada', reservation: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al modificar reserva' });
  }
});

// Cancelar reserva
app.delete('/api/reservations/:id', async (req, res) => {
  const { id } = req.params;
  const { cui } = req.body;

  try {
    const result = await pool.query(
      'UPDATE reservations SET is_cancelled = true WHERE id = $1 AND cui = $2 RETURNING *',
      [id, cui]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada o CUI incorrecto' });
    }

    res.json({ message: 'Reserva cancelada', reservation: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cancelar reserva' });
  }
});

// Cargar XML
app.post('/api/upload', upload.single('file'), async (req, res) => {
  fs.readFile(req.file.path, 'utf8', async (err, data) => {
    if (err) return res.status(400).json({ error: 'Error al leer archivo' });

    xml2js.parseString(data, async (err, result) => {
      if (err) return res.status(400).json({ error: 'XML inválido' });

      let loaded = 0;
      let errors = 0;

      for (let flightSeat of result.flightReservation.flightSeat) {
        try {
          await pool.query(
            `INSERT INTO reservations (
              seat_number, passenger_name, cui, has_luggage, user_email, 
              class_type, selection_method, price
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              flightSeat.seatNumber[0],
              flightSeat.passengerName[0],
              flightSeat.idNumber[0],
              flightSeat.hasLuggage[0] === 'true',
              flightSeat.user[0],
              'economy', // Asumimos economía, puedes mejorar esto
              'manual',
              200 // Precio base
            ]
          );
          loaded++;
        } catch (err) {
          errors++;
          console.error('Error al insertar asiento:', err);
        }
      }

      res.json({
        message: 'Archivo cargado',
        loaded,
        errors,
        time: 42 // Simulado
      });
    });
  });
});

// Reportes
app.get('/api/reports', async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
    const totalReservations = await pool.query('SELECT COUNT(*) FROM reservations');
    const businessOccupied = await pool.query("SELECT COUNT(*) FROM reservations WHERE class_type = 'business' AND is_cancelled = false");
    const economyOccupied = await pool.query("SELECT COUNT(*) FROM reservations WHERE class_type = 'economy' AND is_cancelled = false");
    const businessFree = await pool.query("SELECT COUNT(*) FROM reservations WHERE class_type = 'business' AND is_cancelled = false"); // Ajusta según tu lógica real
    const economyFree = await pool.query("SELECT COUNT(*) FROM reservations WHERE class_type = 'economy' AND is_cancelled = false"); // Ajusta según tu lógica real
    const userSelected = await pool.query("SELECT COUNT(*) FROM reservations WHERE selection_method = 'manual'");
    const randomSelected = await pool.query("SELECT COUNT(*) FROM reservations WHERE selection_method = 'random'");
    const modified = await pool.query("SELECT COUNT(*) FROM reservations WHERE is_modified = true");
    const cancelled = await pool.query("SELECT COUNT(*) FROM reservations WHERE is_cancelled = true");

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalReservations: parseInt(totalReservations.rows[0].count),
      businessOccupied: parseInt(businessOccupied.rows[0].count),
      economyOccupied: parseInt(economyOccupied.rows[0].count),
      businessFree: parseInt(businessFree.rows[0].count), // Ajusta
      economyFree: parseInt(economyFree.rows[0].count), // Ajusta
      userSelected: parseInt(userSelected.rows[0].count),
      randomSelected: parseInt(randomSelected.rows[0].count),
      modified: parseInt(modified.rows[0].count),
      cancelled: parseInt(cancelled.rows[0].count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar reportes' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});