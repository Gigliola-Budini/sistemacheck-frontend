import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { param } from 'jquery';

// Components
import { CrearPassComponent } from "./crear-pass.component";

const routes: Routes = [
  {
    path: "crear/:token",
    component: CrearPassComponent,
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrearPassRoutingModule { }
