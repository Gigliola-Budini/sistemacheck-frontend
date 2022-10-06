import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";

const ENV = environment;
var httpOptions={};

@Injectable({
  providedIn: 'root'
})
export class RestApiCheckService {
  currentUserValue: any;

  private currentUserSubject: BehaviorSubject<any>;
  constructor(private http:HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')!));
    httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          "Authorization": "Basic " + btoa("1111111-1:HospitalSanFernando")
      })
    };
   }

  //Reportes
  getReporteMinsal(desde:string, hasta:string){
    // reporte?fechaDesde=01/01/2022&fechaHasta=30/12/2022
    return this.http.get(`${ENV.api_url}reporte?fechaDesde=${desde}&fechaHasta=${hasta}`,httpOptions);
  }

  getNameVirus(code:any){
    const httpOptions2 = {
      headers: new HttpHeaders({
          'Content-Type': 'text/html',
          "Authorization": "Basic " + btoa("usercheck:check2022")
      })
    };
    return this.http.get(`https://fhir.loinc.org/CodeSystem/$lookup?system=http://loinc.org&code=${code}`,httpOptions2)
  }

  //Crear Hospital
  createHospital(nombreHospital:string){
    return this.http.post(`${ENV.api_url}hospital`,{nombre: nombreHospital},httpOptions);
  }
}
