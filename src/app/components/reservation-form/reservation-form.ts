import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservation-form',
  imports: [FormsModule],
  templateUrl: './reservation-form.html',
  styleUrl: './reservation-form.css',
})
export class ReservationFormComponent {
  // Datos del formulario
  passengerName: string = '';
  cui: string = '';
  email: string = '';
  hasLuggage: boolean = false;
  selectedVuelo: string = '';

  // Asiento seleccionado (debe venir del mapa, pero lo ponemos por defecto para evitar errores)
  selectedSeat: string = 'E5'; // Cambia esto si el asiento se pasa desde otro componente

  // Lista de vuelos (puedes conectar esto a una API después)
  vuelos = [
    { id: 'GT101', nombre: 'GT101 – Ciudad de Guatemala → Miami' },
    { id: 'GT102', nombre: 'GT102 – Miami → Ciudad de Guatemala' },
  ];

  onSubmit() {
    if (!this.passengerName || !this.cui || !this.email || !this.selectedVuelo) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    // Validación básica de CUI (13 dígitos numéricos)
    if (!/^\d{13}$/.test(this.cui)) {
      alert('El CUI debe contener exactamente 13 dígitos numéricos.');
      return;
    }

    // Validación de dominio de correo
    if (!this.email.endsWith('@gmail.com') && !this.email.endsWith('@outlook.com')) {
      alert('Solo se permiten correos con @gmail.com o @outlook.com');
      return;
    }

    // Aquí iría la lógica real: llamar a un servicio HTTP para guardar la reserva
    console.log('Reserva enviada:', {
      seat: this.selectedSeat,
      passengerName: this.passengerName,
      cui: this.cui,
      email: this.email,
      hasLuggage: this.hasLuggage,
      vuelo: this.selectedVuelo,
    });

    alert(`¡Reserva confirmada para el asiento ${this.selectedSeat}!`);
  }
}