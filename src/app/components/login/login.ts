// src/app/components/login/login.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ necesario
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (!this.email || !this.password) {
      alert('Completa todos los campos');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        alert('¡Bienvenido!');
        console.log(response);
      },
      error: (err: any) => {
        console.error(err);
        alert('Error: ' + (err.error?.error || 'Credenciales inválidas'));
      }
    });
  }
}
