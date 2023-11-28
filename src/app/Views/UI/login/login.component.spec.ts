import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GetLoginUseCase } from 'src/app/domain/Login/usecase/getLogin';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: GetLoginUseCase,
          useValue: { postLogin: jasmine.createSpy().and.returnValue(of({ token: 'mockedToken' })) },
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call postLogin method when IniciarSesion is called', async () => {
    const loginService = TestBed.inject(GetLoginUseCase) as jasmine.SpyObj<GetLoginUseCase>;
    await component.IniciarSesion();

    expect(loginService.postLogin).toHaveBeenCalledWith(component.username, component.password);
  });

  it('should navigate to "Inicio" when login is successful', async () => {
    const routerNavigateSpy = spyOn((component as any).router, 'navigate');
    await component.IniciarSesion();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['/Sistema/Inicio/']);
  });

  it('should set loginFailed to true when login is unsuccessful', async () => {
    spyOn((component as any).router, 'navigate');
    spyOn((component as any)._IniciarSesion, 'postLogin').and.returnValue(of(null)); // Simula un error
    await component.IniciarSesion();

    expect(component.loginFailed).toBe(true);
  });
});
