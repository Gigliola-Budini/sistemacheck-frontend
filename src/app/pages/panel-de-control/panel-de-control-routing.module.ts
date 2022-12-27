import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioGuard } from 'src/app/core/guards/usuario.guard'


// Component pages
import { IndicadoresComponent } from "./indicadores/indicadores.component";

const routes: Routes = [
  {
    path: "principal",
    component: IndicadoresComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PanelDeControlRoutingModule {}
