import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { CrearComponent } from "./crear/crear.component";


const routes: Routes = [
  {
    path: "usuarios",
    component: CrearComponent
  },
  {
    path: "crear",
    component: CrearComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuariosRoutingModule {}
