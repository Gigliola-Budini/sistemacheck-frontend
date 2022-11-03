import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from "./usuarios-routing.module";
import { CrearComponent } from "./crear/crear.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Counter
import { CountToModule } from 'angular-count-to';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

import { SharedModule } from '../../shared/shared.module';

// Load Icons
import { defineLordIconElement } from 'lord-icon-element';
import lottie from 'lottie-web';

@NgModule({
  declarations: [
    CrearComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    CountToModule,
    FeatherModule.pick(allIcons),
    SharedModule,
    FormsModule,
    ReactiveFormsModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsuariosModule {
  constructor(){
    defineLordIconElement(lottie.loadAnimation);
  }
 }
