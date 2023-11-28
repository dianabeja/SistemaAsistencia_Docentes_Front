import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoComponent } from './listado.component';
import { GetEscanerDatosUseCase } from './../../../domain/EscanerDatos/usecase/getEscanerDatos';
import { DatosService } from '../inicio/Datos.Service';
import { of } from 'rxjs';

describe('ListadoComponent', () => {
  let component: ListadoComponent;
  let fixture: ComponentFixture<ListadoComponent>;
  let getDatosSpy: jasmine.SpyObj<GetEscanerDatosUseCase>;

  beforeEach(async () => {
    const getDatosSpyObj = jasmine.createSpyObj('GetEscanerDatosUseCase', ['getEscanerDatos']);
    await TestBed.configureTestingModule({
      declarations: [ ListadoComponent ],
      providers: [
        { provide: GetEscanerDatosUseCase, useValue: getDatosSpyObj },
        { provide: DatosService, useValue: { getCarrera: () => '', getNrc: () => '' } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    getDatosSpy = TestBed.inject(GetEscanerDatosUseCase) as jasmine.SpyObj<GetEscanerDatosUseCase>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties correctly', () => {
    expect(component.mostrarLista).toEqual([]);
    expect(component.listaAsistencia).toEqual([]);
    expect(component.nrcMateria).toEqual('');
    expect(component.carrera).toEqual('');
    expect(component.datosCargados).toBeFalse();
    expect(component.fechaCompleta).toBeDefined();
  });

  it('should set the correct date in yyyy:mm:dd format', () => {
    const mockDate = new Date(2023, 10, 1); // Use a specific date for testing
    jasmine.clock().mockDate(mockDate);
  
    component.ngOnInit();
  
    const expectedDate = '2023:11:1'; // Adjust this based on the date you provided
    expect(component.fechaCompleta).toEqual(expectedDate);
  });

  it('should handle errors during getEscanerDatos call', () => {
    const mockError = 'Test error';
    getDatosSpy.getEscanerDatos.and.throwError(mockError);
  
    spyOn(console, 'error'); // Spy on console.error to check if it's called
  
    component.ngOnInit();
  
    expect(getDatosSpy.getEscanerDatos).toHaveBeenCalledWith(component.nrcMateria, component.fechaCompleta);
    expect(console.error).toHaveBeenCalledWith('Error al obtener los datos:', mockError);
  });
});
