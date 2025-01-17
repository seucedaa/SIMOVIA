import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermisosGuard } from 'src/app/guards/permisos.guard';
@NgModule({
    imports: [RouterModule.forChild([
        { 
            path: 'colaborador', 
            canActivate: [PermisosGuard],
            data: { breadcrumb: 'Colaboradores' }, 
            loadChildren: () => import('../componentsgeneral/colaborador/colaborador.module').then(m => m.ColaboradorModule),
        },   
    ])],
    exports: [RouterModule]
})
export class GeneralRoutingModule { }