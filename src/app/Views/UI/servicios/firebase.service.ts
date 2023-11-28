import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirestoreService } from './FirestoreListas.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';



//IMPORTAR EL METODO DE LA API PARA LLAMAR LA INFORMACION DE LA TABLA MATERIA_SALON
//Guardar la info en una variable
//Hacer un metodo para filtrar qué nrc de la peticion coincide con los nrc del docente 
@Injectable({
  providedIn: 'root',
})
export class ListasAsistenciaPostgres {

  Edificio: string | any;
  Salon: string | any;
  Dia: string | any;
  Hora: string | any;
  api = environment.apiDocente + 'MateriaSalon';

  constructor(
    private firestore: AngularFirestore,
    private cache: FirestoreService,
    private http: HttpClient
  ) {

    /* let fecha = new Date();

    let diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    let diaSemana = diasSemana[fecha.getDay()];   console.log('Día de la semana:', diaSemana);

    let horaInicio: any = fecha.getHours();
    if (horaInicio % 2 == 0) {
      horaInicio = horaInicio - 1;
    }
    let hora_fin = (horaInicio + 2) + ':00' ;
    horaInicio = horaInicio + ':00';

    let horaCompleta = horaInicio + '-' + hora_fin; */

    this.Dia = 'lunes';
    this.Hora = '11:00-13:00';
  }

  obtener_MateriasDocentes () {

    let materiasDocente: any = this.cache.obtener_DatoLocal("MateriasDocenteArray");
//Los nrc del docente están guardados en materiasDocente.
    let docente: any = this.cache.obtener_DatoLocal("docenteInfo");

    console.log(materiasDocente)
  }

    getMateriaSalon(Token: string): Observable<any> {
      let header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': Token
    });
      return this.http.get<any>(this.api, { headers: header });
    }
  
}
