import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

// Counter
import { CountToModule } from 'angular-count-to';

// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

// Load Icons
import { defineLordIconElement } from 'lord-icon-element';
import lottie from 'lottie-web';

// Component pages
import { ReporteMinsalComponent } from "./reporte-minsal/reporte-minsal.component";
import { ReportePersonalizadoComponent } from "./reporte-personalizado/reporte-personalizado.component";
import { ReportesRoutingModule } from "./reportes-routing.module";
import { SharedModule } from '../../shared/shared.module';

import {DatePipe} from '@angular/common';

@NgModule({
  declarations: [
    ReporteMinsalComponent,
    ReportePersonalizadoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    CountToModule,
    FlatpickrModule,
    FeatherModule.pick(allIcons),
    ReportesRoutingModule,
    SharedModule
  ],
  providers: [
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportesModule { 
  constructor() {
    defineLordIconElement(lottie.loadAnimation);
  }
}
