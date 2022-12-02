import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioGuard } from 'src/app/core/guards/usuario.guard'


// Component pages
import { CrearComponent } from "./crear/crear.component";
import { ListarComponent } from "./listar/listar.component";
import { EditarComponent } from "./editar/editar.component";

const routes: Routes = [
  {
    path: "listar",
    component: ListarComponent,
    canActivate: [UsuarioGuard]
  },
  {
    path: "crear",
    component: CrearComponent,
    canActivate: [UsuarioGuard]
  },{
    path: "editar/:id",
    component: EditarComponent,
    canActivate: [UsuarioGuard]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuariosRoutingModule {}
