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
  [x: string]: any;
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
  NombreMateria: String | any = '';
  matricula: string='';
  fecha: string='';

  public mostrarTarjeta: boolean = false; // Propiedad para controlar la visibilidad de la tarjeta
  public alumnoSeleccionado: any;
  constructor(
    private servicedatos: DatosService,
    private servicio: ListasAsistenciaPostgres
  ) {
    this.carrera = servicedatos.getCarrera();
    this.nrcMateria = servicedatos.getNrc();
  }

  async ngOnInit() {
    this.listaAsistencia = await this.servicio.consultarListaAsistencia(
      this.nrcMateria,
      //"16234",
      this.carrera
    );
    this.obtenerNombreMateria();
  }

  eliminarFecha( matricula: string, fecha: string) {
    // Forma la ruta completa hacia la colección de fechas que deseas eliminar
    const db = firebase.firestore();

    const rutaInasistencia = `/ISW/Materias/${this.nrcMateria}/${matricula}/Inasistencia/${fecha}`;
    const rutaAsistencia = `/ISW/Materias/${this.nrcMateria}/${matricula}/Asistencia/${fecha}`;

    db.doc(rutaAsistencia).set({
      fecha: fecha,
    }).then(() => {
      console.log('Fecha agregada con éxito');
    }).catch(error => {
      console.error('Error al agregar la fecha:', error);
    });
    
    // Llama a la función de eliminación de Firestore
    db.doc(rutaInasistencia).delete().then(() => {
      console.log('Fecha eliminada con éxito');
    }).catch(error => {
      console.error('Error al eliminar la fecha:', error);
    });
  }

  Imprimir() {
    this.servicio.ExportarExcel(this.nrcMateria);
  }

  async obtenerNombreMateria() {
    let materia = await this.servicio.Obtener_Materia_EnCurso();
    this.NombreMateria = materia[0].nombre;
  }

  GuardarDatosEnFirestore() {
    const db = firebase.firestore();

    let array: any = [
      [
        'S20006732',
        'Yahir Jesus Jacome Cogco',
        '2da',
        'ISW',
        'https://firebasestorage.googleapis.com/v0/b/heartmodel-caedd.appspot.com/o/foto-perfil-generica.jpg?alt=media&token=4b535835-114a-4db6-b2dc-dba46cb3b96e',
      ],
    ];

    for (let i = 0; i < array.length; i++) {
      const datos_lista: any = {
        Matricula: array[i][0],
        Nombre: array[i][1],
        Status: array[i][2],
        Carrera: array[i][3],
        URL: array[i][4],
      };

      // Crear una ruta dinámica que incluye la matrícula
      const rutaDocumento = db.collection(`ISW/Materias/98125`);

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
      batch.set(docRefAsistencia, {});

      // Realizar una operación en la subcolección "Inasistencia" para crearla si no existe
      const docRefInasistencia = docRef.collection('Inasistencia').doc(' ');
      batch.set(docRefInasistencia, {});

      // Realizar todas las operaciones en el lote de escritura
      batch
        .commit()
        .then(() => {
          console.log(
            'Datos de lista de asistencia y subcolecciones creadas con éxito.'
          );
        })
        .catch((error) => {
          console.error(
            'Error al guardar los datos de lista de asistencia:',
            error
          );
        });
    }
  }

  confirmarEliminarFecha(matricula: string, fecha: string) {
    const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar esta inasistencia?');
    if (confirmacion) {
      this.eliminarFecha(matricula, fecha);
    }
  }

  ElegirAlumno() {
    console.log('alumno elegido');
  }
}
