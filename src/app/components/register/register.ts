// src/app/components/register/register.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true, // ✅ necesario
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [FormsModule]
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (!this.email || !this.password) {
      alert('Completa todos los campos');
      return;
    }

    if (!this.email.endsWith('@gmail.com') && !this.email.endsWith('@outlook.com')) {
      alert('Solo se permiten correos @gmail.com o @outlook.com');
      return;
    }

    this.authService.register(this.email, this.password).subscribe({
      next: (response: any) => {
        alert('¡Cuenta creada con éxito!');
        console.log(response);
      },
      error: (err: any) => {
        console.error(err);
        alert('Error: ' + (err.error?.error || 'No se pudo crear la cuenta'));
      }
    });
  }
}
