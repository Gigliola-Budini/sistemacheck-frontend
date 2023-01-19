import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { ListadoComponent } from "./listado/listado.component";


const routes: Routes = [
  {
    path: "",
    component: ListadoComponent
  },
  {
    path: "listado",
    component: ListadoComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamenesRoutingModule {}
