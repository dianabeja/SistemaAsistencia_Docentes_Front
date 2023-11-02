import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GetMateriaUseCase } from 'src/app/domain/Materia/usecase/client/getMateria';
import { DatosService } from './Datos.Service';
import { FirestoreService } from '../servicios/FirestoreListas.service';
import { GetListaAsistenciaUseCase } from 'src/app/domain/ListaAsistencia/usecase/getLista';
import { PostTokenUseCase } from 'src/app/domain/Tokens/usecase/postTokens';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  constructor(
    private _getMateriasCasosUso: GetMateriaUseCase,
    private _generarToken: PostTokenUseCase,
    private _getCantidadLista: GetListaAsistenciaUseCase,
    private servicedatos: DatosService,
    private datosLocales: FirestoreService
  ) {}

  public nrc$: any;
  //variable de tipo array para el almacenamiento de la información de cada materia del docente
  public Materias: Array<any> = [];
  public cantidad_alumnos: any[] = [];

  public materias$: any;
  public Token: string | any;
  public TokenNrc: string | any;

  public datos: any;
  public dato: number = 0;

  async ngOnInit() {
    //Se guarda en una nueva variable el token que está almacenado en el caché del navegador
    this.Token = this.datosLocales.obtener_DatoLocal('Resp');
    console.log(this.Token);
    //Obtener NRC del docente mandando su token
    await this.obtener_nrcMaterias(this.Token);
    //Generar nuevo token con el array de NRC
    await this.generarToken(this.nrc$.nrcs);
    //
    await this.obtener_Materias(this.TokenNrc.token);
  }


  //Este metodo generará un nuevo token cuyo contenido será el array de los NRC obtenidos en la peticion obtener_nrcMaterias
  //Esto con el fin de proteger los datos en el trafico de peticiones
  //Su controlador en la api es generarToken, ahí se guardará el valor mandado aquí junto a una contraseña definida
  async generarToken(valor: string | any) {
    //Almacenar en una nueva variable el token obtenido de la api
    this.TokenNrc = await new Promise((resolve, reject) => {
      this._generarToken.postTokens(valor).subscribe(
        (Resp: any) => {
          resolve(Resp);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  //obtener la cantidad de estudiantes resgistrados en una materia
  async obtener_cantidadEstudiantes() {
    //obtener el nrc de la materia de cada objeto del array a través de su campo materia.nrc con ayuda de la funcion map
    let nrc: string[] | any = await this.Materias.map(
      (materia: any) => materia.nrc
    );
    console.log("materiaas "+this.Materias)
    //obtener la licenciatura de la materia de cada objeto del array a través de su campo materia.licenciatura con ayuda de la funcion map
    let carrera: string[] | any = await this.Materias.map(
      (materia: any) => materia.licenciatura
      
    );
    console.log(nrc)
    //se itera las mismas veces que el tamaño del arreglo de nrc/carrera
    for (let a = 0; a <= nrc.length - 1; a++) {
      //guardar en una nueva variable de tipo array la cantidad de alumnos obtenida de su consulta con el metodo establecido
      this.cantidad_alumnos[a] =
      //se obtiene la cantidad de alumnos registrados utilizando el siguiente método, pasando como
      // parametro el nrc y la carrera con su posisión correspondiente(a)
        await this._getCantidadLista.getCantidadListaAsistencia(
          nrc[a],
          carrera[a]
        );
    }
  }
//Este método manda una petición a la api para obtener los NRC(solo el nrc) que corresponda a este docente
//Se mandará el token , este contendrá el numero de personal del docente
//El metodo del controlador de la api correspondiente es DocentesMateria
  async obtener_nrcMaterias(Token: string) {
    //Guardar en variable nrc$ el arreglo de NRC obtenido de la petición
    this.nrc$ = await new Promise((resolve, reject) => {
      this._getMateriasCasosUso.getNRCMaterias(Token).subscribe(
        (Resp: any) => {
          //Devuelve un arreglo de NRC
          
          resolve(Resp);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
    console.log('Obtener materaaaas:'+this.nrc$)
  }

  //Este metodo recibirá un token cuyo valor será el array de NRC y devolverá la informacion necesaria de cada nrc
  async obtener_Materias(materia: any) {
    //almacenar los datos filtrados devueltos por la api en una nueva variable 
    this.materias$ = await new Promise((resolve, reject) => {
      this._getMateriasCasosUso.getMateriasAll(materia).subscribe(
        (Resp: any) => {
          console.log(Resp);
          resolve(Resp);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
    //guardar en variable tipo array(para poder recorrer cada objeto en un for) los datos obtenidos
    this.Materias = this.materias$;
    await this.obtener_cantidadEstudiantes();
  }

  //guardar los valores de nrc y carrera para la visualización de su lista de asistencia correspondiente
  enviarDato(nrc: any, carrera: any) {
    this.servicedatos.setCarrera(carrera);
    this.servicedatos.setNrc(nrc);
  }
}
