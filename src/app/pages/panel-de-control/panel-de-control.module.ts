import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelDeControlRoutingModule } from "./panel-de-control-routing.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Counter
import { CountToModule } from 'angular-count-to';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';
import flatpickr from 'flatpickr';
import { Spanish } from "flatpickr/dist/l10n/es";

import { SharedModule } from 'src/app/shared/shared.module';

// Load Icons
import { defineLordIconElement } from 'lord-icon-element';
import lottie from 'lottie-web';
import Swal from 'sweetalert2';
import { DataTablesModule } from "angular-datatables";

// Apex Chart Package
import { NgApexchartsModule } from 'ng-apexcharts';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { IndicadoresComponent } from "./indicadores/indicadores.component";
import { WidgetModule } from '../../shared/widget/widget.module';

flatpickr.localize(Spanish);
// export function flatpickrFactory() {
//   flatpickr.localize(Spanish);
//   return flatpickr;
// }

@NgModule({
  declarations: [
    IndicadoresComponent
  ],
  imports: [
    CommonModule,
    PanelDeControlRoutingModule,
    CountToModule,
    FeatherModule.pick(allIcons),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    FlatpickrModule.forRoot(),
    NgApexchartsModule,
    WidgetModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
 
})
export class PanelDeControlModule {
  constructor(){
    defineLordIconElement(lottie.loadAnimation);
  } 
}
