// src/app/app.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { HttpClientModule } from '@angular/common/http'; // 👈 Importa HttpClientModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HttpClientModule], // 👈 Incluye HttpClientModule aquí
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = signal('Sistema de Reserva de Asientos ✈️');
}