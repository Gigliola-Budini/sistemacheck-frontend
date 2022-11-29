import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioGuard } from 'src/app/core/guards/usuario.guard'


// Component pages
import { CrearComponent } from "./crear/crear.component";


const routes: Routes = [
  {
    path: "usuarios",
    component: CrearComponent,
    canActivate: [UsuarioGuard]
  },
  {
    path: "crear",
    component: CrearComponent,
    canActivate: [UsuarioGuard]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuariosRoutingModule {}
