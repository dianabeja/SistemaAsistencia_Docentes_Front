import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroComponent } from './registro.component';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compare passwords correctly', () => {
    component.contrasena_usuario = 'password';
    component.confirmar_contrasena = 'password';
    component.compararContraseña(component.contrasena_usuario, component.confirmar_contrasena);
    expect(component.comparar).toBe(true);
  });

  it('should not allow registration if passwords do not match', () => {
    component.contrasena_usuario = 'password1';
    component.confirmar_contrasena = 'password2';
    component.CrearCuenta();
    expect(component.Mensaje_Contrasena).toBe(true);
  });

  it('should upload image to storage', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    spyOn(component, 'SubirImagenFirestore').and.callThrough();
    component.file = file;
    await component.CrearCuenta();
    expect(component.imageURL).toBeTruthy();
  });

});
