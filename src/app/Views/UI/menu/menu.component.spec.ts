import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close session when the button is clicked', ()=> {
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    expect(component.CerrarSesion).toBeTruthy
  });

  it('should navigate to "/Sistema/Inicio" when "Inicio" link is clicked', () => {
    const navigateSpy = spyOn((component as any).router, 'navigateByUrl');
    const inicioLink = fixture.debugElement.nativeElement.querySelector('a[routerLink="/Sistema/Inicio"]');
    inicioLink.click();
    expect(navigateSpy).toHaveBeenCalledWith('/Sistema/Inicio');
  });

  it('should navigate to "Listado" when "Listado" link is clicked', () => {
    const navigateSpy = spyOn((component as any).router, 'navigateByUrl');
    const listadoLink = fixture.debugElement.nativeElement.querySelector('a[routerLink="/Sistema/Inicio/Listado"]');
    listadoLink.click();
    expect(navigateSpy).toHaveBeenCalledWith('/Sistema/Inicio/Listado');
  });

  it('should call CerrarSesion method when "Cerrar Sesion" button is clicked', () => {
    const cerrarSesionSpy = spyOn(component, 'CerrarSesion');
    const cerrarSesionButton = fixture.debugElement.nativeElement.querySelector('button');
    cerrarSesionButton.click();
    expect(cerrarSesionSpy).toHaveBeenCalled();
  });
});
