import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteComponent } from './docente.component';

describe('DocenteComponent', () => {
  let component: DocenteComponent;
  let fixture: ComponentFixture<DocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle datos.title existence correctly', () => {
    component.datos = {
      title: 'Titulo',
      // Otros datos necesarios para la prueba
    };
  
    fixture.detectChanges();
  
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.btn.info')).toBeFalsy(); // No debería mostrar la información en este caso
    // Puedes agregar más expectativas según sea necesario
  });
  
  it('should display docente image correctly', () => {
    component.datos = {
      nombre: 'Nombre',
      url_imagen: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Logo_de_la_Universidad_Veracruzana.svg',
      // Otros datos necesarios para la prueba
    };
  
    fixture.detectChanges();
  
    const compiled = fixture.nativeElement;
    const imgElement = compiled.querySelector('img');
    expect(imgElement).toBeTruthy();
    expect(imgElement.src).toContain('https://upload.wikimedia.org/wikipedia/commons/8/8f/Logo_de_la_Universidad_Veracruzana.svg');
    // P
  });

  
});
