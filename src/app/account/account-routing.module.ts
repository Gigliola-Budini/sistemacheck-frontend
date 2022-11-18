import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { CrearPassModule } from "./auth/crear-pass/crear-pass.module";
const routes: Routes = [
 
  {
    path: 'logout', loadChildren: () => import('./auth/logout/logout.module').then(m => m.LogoutModule)
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: 'clave', loadChildren: () => import('./auth/crear-pass/crear-pass.module').then(m => m.CrearPassModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
