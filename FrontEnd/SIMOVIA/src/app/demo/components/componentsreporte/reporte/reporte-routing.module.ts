import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReporteComponent } from './reporte.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ReporteComponent },
    ])],
    exports: [RouterModule]
})
export class ReporteRoutingModule { }
