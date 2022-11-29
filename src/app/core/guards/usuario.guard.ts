import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { environment } from '../../../environments/environment';
const idModulo = 2;
@Injectable({ providedIn: 'root' })
export class UsuarioGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authFackservice: AuthfakeauthenticationService,
        private TokenStorageService : TokenStorageService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        const roles : any[]= this.TokenStorageService.getRoles();
        console.log(roles);
        if(roles.length){
            let id = roles.findIndex((elem)=>elem.id == idModulo)

            if(id != -1){
                console.log(id, idModulo);
                
                return true;
            }
        }
        
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
