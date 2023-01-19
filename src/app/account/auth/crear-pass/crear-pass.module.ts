import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Load Icons
import { defineLordIconElement } from 'lord-icon-element';
import lottie from 'lottie-web';

// Component
import { CrearPassComponent } from './crear-pass.component';
import { CrearPassRoutingModule } from "./crear-pass-routing.module";
@NgModule({
  declarations: [
    CrearPassComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CrearPassRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrearPassModule { 
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
  }


  
}
