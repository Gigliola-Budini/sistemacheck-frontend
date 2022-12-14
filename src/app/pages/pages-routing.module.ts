import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component pages
import { DashboardComponent } from "./dashboards/dashboard/dashboard.component";
import { ReportesModule } from './reportes/reportes.module';

const routes: Routes = [
    {
        path: "",
        component: DashboardComponent
    },
    {
      path: '', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
    },
    {
      path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)
    },
    {
      path: 'crypto', loadChildren: () => import('./crypto/crypto.module').then(m => m.CryptoModule)
    },
   
    {
      path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
    },
    {
      path: 'reportes', loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule)
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
