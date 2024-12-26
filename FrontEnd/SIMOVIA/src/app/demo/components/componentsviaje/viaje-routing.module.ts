import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermisosGuard } from 'src/app/guards/permisos.guard';

@NgModule({
    imports: [RouterModule.forChild([
        { 
            path: 'viaje', 
            canActivate: [PermisosGuard],
            data: { breadcrumb: 'Viajes' }, 
            loadChildren: () => import('../componentsviaje/viaje/viaje.module').then(m => m.ViajeModule),
        },   
    ])],
    exports: [RouterModule]
})
export class ViajeRoutingModule { }