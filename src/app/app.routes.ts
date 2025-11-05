// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Importamos los componentes
import { HomeComponent } from './components/home/home';
import { RegisterComponent } from './components/register/register';
import { LoginComponent } from './components/login/login';
import { SeatMapComponent } from './components/seat-map/seat-map';
import { ReservationFormComponent } from './components/reservation-form/reservation-form';
import { UploadXmlComponent } from './components/upload-xml/upload-xml';
import { ReportsComponent } from './components/reports/reports';
import { AboutComponent } from './components/about/about';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'seat-map', component: SeatMapComponent },
  { path: 'reservation', component: ReservationFormComponent },
  { path: 'upload', component: UploadXmlComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' } // ruta por defecto
];
