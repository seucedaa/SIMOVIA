import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermisosGuard } from 'src/app/guards/permisos.guard';
@NgModule({
    imports: [RouterModule.forChild([
        { 
            path: 'reporte', 
            canActivate:[PermisosGuard],
            data: { breadcrumb: 'reporte' }, 
            loadChildren: () => import('../componentsreporte/reporte/reporte.module').then(m => m.ReporteModule),
        },   
    ])],
    exports: [RouterModule]
})
export class ReporteRoutingModule { }