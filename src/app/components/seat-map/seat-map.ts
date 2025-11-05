import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 Importa CommonModule

@Component({
  selector: 'app-seat-map',
  templateUrl: './seat-map.html',
  styleUrls: ['./seat-map.css'],
  imports: [CommonModule] // 👈 Añade CommonModule aquí
})
export class SeatMapComponent {
  // Filas y columnas para Clase de Negocios (2 columnas)
  businessRows = ['A', 'C', 'D', 'F', 'G', 'I'];
  businessCols = ['1', '2'];

  // Filas y columnas para Clase Económica (5 columnas)
  economyRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  economyCols = ['3', '4', '5', '6', '7'];

  // Estado de los asientos: 'available', 'occupied', 'selected'
  seats: any = {};

  constructor() {
    this.initializeSeats();
  }

  initializeSeats() {
    // Clase de Negocios
    for (let row of this.businessRows) {
      for (let col of this.businessCols) {
        const seatId = `B-${row}${col}`;
        this.seats[seatId] = 'available';
      }
    }

    // Clase Económica
    for (let row of this.economyRows) {
      for (let col of this.economyCols) {
        const seatId = `E-${row}${col}`;
        this.seats[seatId] = 'available';
      }
    }
  }

  getSeatStatus(classType: string, row: string, col: string): string {
    const seatId = `${classType}-${row}${col}`;
    return this.seats[seatId] || 'available';
  }

  toggleSeat(classType: string, row: string, col: string) {
    const seatId = `${classType}-${row}${col}`;
    if (this.seats[seatId] === 'available') {
      this.seats[seatId] = 'selected';
    } else if (this.seats[seatId] === 'selected') {
      this.seats[seatId] = 'available';
    }
  }

  confirmSelection() {
    const selectedSeats = Object.keys(this.seats).filter(key => this.seats[key] === 'selected');
    if (selectedSeats.length > 0) {
      alert(`Has seleccionado ${selectedSeats.length} asiento(s): ${selectedSeats.join(', ')}`);
    } else {
      alert('No has seleccionado ningún asiento.');
    }
  }
}