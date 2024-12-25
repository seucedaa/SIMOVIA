import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
@NgModule({
    imports: [RouterModule.forChild([
        { 
            path: 'viaje', 
            data: { breadcrumb: 'Viajes' }, 
            loadChildren: () => import('../componentsviaje/viaje/viaje.module').then(m => m.ViajeModule),
            // canActivate: [AuthGuard, RoleGuard],  
        },   
    ])],
    exports: [RouterModule]
})
export class ViajeRoutingModule { }
