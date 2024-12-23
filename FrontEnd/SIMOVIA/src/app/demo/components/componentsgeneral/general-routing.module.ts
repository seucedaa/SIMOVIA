import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
@NgModule({
    imports: [RouterModule.forChild([
        { 
            path: 'colaborador', 
            data: { breadcrumb: 'Colaboradores' }, 
            loadChildren: () => import('../componentsgeneral/colaborador/colaborador.module').then(m => m.ColaboradorModule),
            // canActivate: [AuthGuard, RoleGuard],  
        },   
    ])],
    exports: [RouterModule]
})
export class GeneralRoutingModule { }
