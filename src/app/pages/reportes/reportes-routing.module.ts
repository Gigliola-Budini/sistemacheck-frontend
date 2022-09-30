import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { ReporteMinsalComponent } from "./reporte-minsal/reporte-minsal.component";
import { ReportePersonalizadoComponent } from "./reporte-personalizado/reporte-personalizado.component";


const routes: Routes = [
  {
    path: "minsal",
    component: ReporteMinsalComponent
  },
  {
    path: "personalizado",
    component: ReportePersonalizadoComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportesRoutingModule {}
