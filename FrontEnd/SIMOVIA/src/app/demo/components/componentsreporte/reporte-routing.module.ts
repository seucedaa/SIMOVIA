import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
@NgModule({
    imports: [RouterModule.forChild([
        { 
            path: 'colaborador', 
            data: { breadcrumb: 'Colaboradores' }, 
            loadChildren: () => import('../componentsgeneral/colaborador/colaborador.module').then(m => m.ColaboradorModule),
        },   
    ])],
    exports: [RouterModule]
})
export class ReporteRoutingModule { }
