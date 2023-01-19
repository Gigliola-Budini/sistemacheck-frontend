import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamenesRoutingModule } from "./examenes-routing.module";
import { ListadoComponent } from "./listado/listado.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

// Counter
import { CountToModule } from 'angular-count-to';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

import { SharedModule } from '../../shared/shared.module';

// Load Icons
import { defineLordIconElement } from 'lord-icon-element';
import { DataTablesModule } from "angular-datatables";
import lottie from 'lottie-web';

@NgModule({
  declarations: [
    ListadoComponent
  ],
  imports: [
    CommonModule,
    ExamenesRoutingModule,
    CountToModule,
    FeatherModule.pick(allIcons),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    DataTablesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExamenesModule {
  constructor(){
    defineLordIconElement(lottie.loadAnimation);
  }
 }
