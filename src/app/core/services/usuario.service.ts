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
export class UsuarioService {
  currentUserValue: any;
  user:any;
  token:any;
  httpOptions:any;
  private currentUserSubject: BehaviorSubject<any>;
  constructor(private http:HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')!));
    this.user = JSON.parse(localStorage.getItem('currentUser')!)
    this.token = localStorage.getItem('token')
    console.log(this.currentUserSubject);
    
    this.httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          "Authorization": `Basic  ${this.user.basic}`
      })
    };
   }

  //Usuario
  createUser(usuario){
    return this.http.post(`${ENV.api_url}register`,usuario,this.httpOptions);
  }

  changePass(pass, id){
    return this.http.put(`${ENV.api_url}user/password/cambiar`,{"secret":id,"password":pass},this.httpOptions);
  }

  verifyChangePass(id){
    return this.http.get(`${ENV.api_url}user/password/cambiar?secret=${id}`);
  }

  // {
//     "idUser":3,
//     "userName":"Gustavo",
//     "email":"gustavo@impactis.cl"
// }
  sendEmailPass(usuario){
    return this.http.post(`${ENV.api_url}/user/password/habilitar?token=${this.token}`,usuario,this.httpOptions);
  }
  getUsuariosHospital(idHospital){
    return this.http.get(`${ENV.api_url}/user/hospital?token=${this.token}&hospital=${idHospital}`,this.httpOptions);
  }
 
}
