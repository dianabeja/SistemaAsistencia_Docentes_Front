import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatosService } from '../inicio/Datos.Service';
import { HttpClient } from '@angular/common/http';
import { GetListaAsistenciaUseCase } from 'src/app/domain/ListaAsistencia/usecase/getLista';
import * as XLSX from 'xlsx';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import { ListasAsistenciaPostgres } from '../servicios/firebase.service';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.scss'],
})

export class Listas implements OnInit {
  listaAsistencia: any[] | any = [];
  nrcMateria: any;
  carrera: any;
  jsonData: any;

  archivoRecibido: File | any;
  vistaPreviaArchivo: boolean | any;
  mensajeSubir: boolean | any;
  Guardar_Datos: any[] = [];
  Dia!: String;
  Hora!: String;
  public mostrarTarjeta: boolean = false; // Propiedad para controlar la visibilidad de la tarjeta
  public alumnoSeleccionado: any; 
  constructor(
    private _getListaAsistenciaCasosUso: GetListaAsistenciaUseCase,
    private servicedatos: DatosService,
    private http: HttpClient,
    private servicio: ListasAsistenciaPostgres,
  ) {
    this.carrera = servicedatos.getCarrera();
    this.nrcMateria = servicedatos.getNrc();
  }

  async ngOnInit() {
    this.listaAsistencia =
    await this.servicio.consultarListaAsistencia(
      this.nrcMateria,
      //"16234",
      this.carrera
    );
  console.log('lista de asistencia', this.listaAsistencia);

  }

  Imprimir () {
    this.servicio.ExportarExcel(this.nrcMateria);
  }
  

  Archivo(event: any) {
    const file = event.target.files[0];
    this.RecibirArchivo(file);
  }

  RecibirArchivo(file: File) {
    const archivo: any = new FileReader();
    archivo.onload = (e: any) => {
      const leer_Archivo: any = new Uint8Array(e.target.result);
      const acceder_Datos: any = XLSX.read(leer_Archivo, { type: 'array' });
      const acceder_HojaArchivo: any =
        acceder_Datos.Sheets[acceder_Datos.SheetNames[0]];

      console.log(acceder_HojaArchivo);

      const Matricula: any = XLSX.utils.sheet_to_json(acceder_HojaArchivo, {
        range: 'D11:D36',
        header: 1,
      });
      const Nombre: any = XLSX.utils.sheet_to_json(acceder_HojaArchivo, {
        range: 'H11:H36',
        header: 1,
      });
      const Status: any = XLSX.utils.sheet_to_json(acceder_HojaArchivo, {
        range: 'O11:O36',
        header: 1,
      });
      const Carrera: any = XLSX.utils.sheet_to_json(acceder_HojaArchivo, {
        range: 'P11:P36',
        header: 1,
      });


      for (let i = 2; i < Matricula.length; i++) {
        const datos_lista: any[] = [
          Matricula[i][0],
          Nombre[i][0],
          Status[i][0],
          Carrera[i][0],
        ];
        this.Guardar_Datos.push(datos_lista);
      }

      this.jsonData = this.Guardar_Datos;
      this.vistaPreviaArchivo = true;
    };
    archivo.readAsArrayBuffer(file);
  }

  GuardarDatosEnFirestore() {
    const db = firebase.firestore();

    let array: any = [
      ["S20006732", "Yahir Jesus Jacome Cogco", "2da", "ISW", 'https://firebasestorage.googleapis.com/v0/b/heartmodel-caedd.appspot.com/o/foto-perfil-generica.jpg?alt=media&token=4b535835-114a-4db6-b2dc-dba46cb3b96e'],
      ["S20006730", "Carlos Arturo Jose Fragoso", "2da", "ISW", 'https://firebasestorage.googleapis.com/v0/b/heartmodel-caedd.appspot.com/o/foto-perfil-generica.jpg?alt=media&token=4b535835-114a-4db6-b2dc-dba46cb3b96e'],
      ["S20006728", "Erick Juarez Espinosa", "2da", "ISW", 'https://firebasestorage.googleapis.com/v0/b/heartmodel-caedd.appspot.com/o/foto-perfil-generica.jpg?alt=media&token=4b535835-114a-4db6-b2dc-dba46cb3b96e'],
      ["S20006748", "Rodrigo Mencias Gonzalez", "2da", "ISW", 'https://firebasestorage.googleapis.com/v0/b/heartmodel-caedd.appspot.com/o/foto-perfil-generica.jpg?alt=media&token=4b535835-114a-4db6-b2dc-dba46cb3b96e'],
      ["S20006761", "Itzel Mendez Martinez", "2da", "ISW", 'https://firebasestorage.googleapis.com/v0/b/heartmodel-caedd.appspot.com/o/foto-perfil-generica.jpg?alt=media&token=4b535835-114a-4db6-b2dc-dba46cb3b96e'],
      ["S19004877", "Jesus Saith Meneses Conde", "2da", "ISW", 'https://firebasestorage.googleapis.com/v0/b/heartmodel-caedd.appspot.com/o/foto-perfil-generica.jpg?alt=media&token=4b535835-114a-4db6-b2dc-dba46cb3b96e'],
      ["S20006742", "Axel Gustavo Peña Sanchez", "2da", "ISW", 'https://firebasestorage.googleapis.com/v0/b/heartmodel-caedd.appspot.com/o/foto-perfil-generica.jpg?alt=media&token=4b535835-114a-4db6-b2dc-dba46cb3b96e'],
      ["S20006770", "Adriel Eduardo Peregrina Soto", "2da", "ISW", 'https://firebasestorage.googleapis.com/v0/b/heartmodel-caedd.appspot.com/o/foto-perfil-generica.jpg?alt=media&token=4b535835-114a-4db6-b2dc-dba46cb3b96e'],
    ]

    for (let i = 0; i < array.length; i++) {
      const datos_lista: any = {
        Matricula: array[i][0],
        Nombre: array[i][1],
        Status: array[i][2],
        Carrera: array[i][3],
        URL:array[i][4],
      };

      // Crear una ruta dinámica que incluye la matrícula
      const rutaDocumento = db.collection(
        `ISW/Materias/98125`
      );

      // Darle un id al documento de lista de asistencia con el nombre de la matrícula
      const docRef = rutaDocumento.doc(datos_lista.Matricula);

      // Inicializar un lote de escritura para realizar múltiples operaciones en una transacción.
      const batch = db.batch();

      // Realizar una operación en el documento principal
      batch.set(docRef, {
        Matricula: datos_lista.Matricula,
        Nombre: datos_lista.Nombre,
        Status: datos_lista.Status,
        Carrera: datos_lista.Carrera,
        url: datos_lista.URL,
      });

      // Realizar una operación en la subcolección "Asistencia" para crearla si no existe
      const docRefAsistencia = docRef.collection('Asistencia').doc(' ');
      batch.set(docRefAsistencia, { });

      // Realizar una operación en la subcolección "Inasistencia" para crearla si no existe
      const docRefInasistencia = docRef.collection('Inasistencia').doc(' ');
      batch.set(docRefInasistencia, { });

      // Realizar todas las operaciones en el lote de escritura
      batch.commit()
        .then(() => {
          console.log('Datos de lista de asistencia y subcolecciones creadas con éxito.');
        })
        .catch((error) => {
          console.error('Error al guardar los datos de lista de asistencia:', error);
        });
     }
  }

  ElegirAlumno() {
    console.log("alumno elegido")
  }

  
}
