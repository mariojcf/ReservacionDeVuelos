import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register'; // ✅ Correcto

describe('RegisterComponent', () => {
  let component: RegisterComponent; // ✅ Cambiado de 'Register' a 'RegisterComponent'
  let fixture: ComponentFixture<RegisterComponent>; // ✅ Cambiado aquí también

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent] // ✅ Asegúrate de que sea RegisterComponent
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent); // ✅ Aquí también
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
