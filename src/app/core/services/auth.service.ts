import { Injectable } from '@angular/core';
import { getFirebaseBackend } from '../../authUtils';
import { User } from '../models/auth.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalComponent } from "../../global-component";
import { environment } from "src/environments/environment";

const AUTH_API = GlobalComponent.AUTH_API;
const ENV = environment;

// const httpOptions = {
//  headers: headers_object
// };

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Authorization": "Basic " + btoa("1:main")
    })
};

// const httpOptions = {
//     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
//   };
  

@Injectable({ providedIn: 'root' })

/**
 * Auth-service Component
 */
export class AuthenticationService {

    user!: User;
    currentUserValue: any;

    private currentUserSubject: BehaviorSubject<User>;
    // public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
        // this.currentUser = this.currentUserSubject.asObservable();
     }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register2(rut: string, nombre: string, rol: string, password: string, hospital:string) {        
        // return getFirebaseBackend()!.registerUser(email, password).then((response: any) => {
        //     const user = response;
        //     return user;
        // });

        // Register Api
        return this.http.post(ENV.api_url + 'register', {
            rut,
            "name":nombre,
            password,
            "idRol":rol,
            "idHospital":hospital
          }, httpOptions);
    }

    register(email: string, first_name: string, password: string) {        
        // return getFirebaseBackend()!.registerUser(email, password).then((response: any) => {
        //     const user = response;
        //     return user;
        // });

        // Register Api
        return this.http.post(AUTH_API + 'signup', {
            email,
            first_name,
            password,
          }, httpOptions);
    }

    /**
     * Performs the auth
     * @param rut rut of user
     * @param password password of user
     */
    login2(email: string, password: string) {
        // return getFirebaseBackend()!.loginUser(email, password).then((response: any) => {
        //     const user = response;
        //     return user;
        // });

        return this.http.post(AUTH_API + 'signin', {
            email,
            password
          }, httpOptions);
    }
    login(rut: string, password: string) {
        const httpOptions2 = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                "Authorization": "Basic " + btoa(`${rut}:${password}`)
            })
        };
        return this.http.post(ENV.api_url + 'login',{}, httpOptions2);
    }

    /**
     * Returns the current user
     */
    public currentUser(): any {
        return getFirebaseBackend()!.getAuthenticatedUser();
    }

    /**
     * Logout the user
     */
    logout() {
        // logout the user
        // return getFirebaseBackend()!.logout();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null!);
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return getFirebaseBackend()!.forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

}

