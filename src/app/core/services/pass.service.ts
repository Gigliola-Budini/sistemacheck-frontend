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
export class PassService {
  constructor(private http:HttpClient) {
   }

  changePass(pass, id){
    return this.http.put(`${ENV.api_url}user/password/cambiar`,{"secret":id,"password":pass});
  }

  verifyChangePass( id){
    return this.http.get(`${ENV.api_url}user/password/cambiar?secret=${id}`).toPromise().then((res:any)=>{
      console.log(res);
      if(res.status == 200 && res == 'OK'){
        return true
      }
      return false
    }).catch((err)=>{
      console.log(err);
      return false;
      
    });
  }
}
