import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { Thumbs } from 'swiper';

const ENV = environment;
var httpOptions={};

@Injectable({
  providedIn: 'root'
})
export class RestApiCheckService {
  currentUserValue: any;
  user:any;
  token:any;
  private currentUserSubject: BehaviorSubject<any>;
  constructor(private http:HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')!));
    this.user = JSON.parse(localStorage.getItem('currentUser')!)
    this.token = localStorage.getItem('token')
    console.log(this.currentUserSubject);
    
    httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          "Authorization": `Basic  ${this.user.basic}`
      })
    };
   }

  //Reportes
  getReporteMinsal(desde:string, hasta:string){
    // reporte?fechaDesde=01/01/2022&fechaHasta=30/12/2022
    return this.http.get(`${ENV.api_url}reporte?fechaDesde=${desde}&fechaHasta=${hasta}&token=${this.token}`,httpOptions);
  }

  getNameVirus(code:any){
    const httpOptions2 = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          // "Authorization": "Basic " + btoa("usercheck:check2022")
          "Authorization": "Basic dXNlcmNoZWNrOmNoZWNrMjAyMg=="
      })
    };
    return this.http.get(`https://fhir.loinc.org/CodeSystem/$lookup?system=http://loinc.org&code=${code}`,httpOptions)
  }

  getExamenes(fechaInicio:string, fechaTermino:string){
    // /Casos/fecha?fechaDesde=03/10/2022&fechaHasta=09/10/2022
    return this.http.get(`${ENV.api_url}Casos/fecha?fechaDesde=${fechaInicio}&fechaHasta=${fechaTermino}&token=${this.token}`,httpOptions)
    
  }

  //Crear Hospital
  createHospital(nombreHospital:string){
    return this.http.post(`${ENV.api_url}hospital`,{nombre: nombreHospital},httpOptions);
  }

  getHospitales(){
    return this.http.get(`${ENV.api_url}hospital?token=${this.token}`,httpOptions);
  }

  getServiciosSalud(){
    return this.http.get(`${ENV.api_url}ServicioSalud?token=${this.token}`,httpOptions);
  }
  
  getRoles(){
    return this.http.get(`${ENV.api_url}roles?token=${this.token}`,httpOptions);
  }

  getIndicadores(fechaIni,fechaFin){
    return this.http.get(`${ENV.api_url}estadistica/virus/fecha?fechaDesde=${fechaIni}&fechaHasta=${fechaFin}&token=${this.token}`,httpOptions);
  }

  getIndicadores2(fechaIni,fechaFin){
    return this.http.get(`${ENV.api_url}estadistica/virus/fecha/rangoEtereo?fechaDesde=${fechaIni}&fechaHasta=${fechaFin}&token=${this.token}`,httpOptions);
  }
}
