import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ViajeComponent } from './viaje.component';
import { ViajeEditarComponent } from './viajeeditar/viajeeditar.component';
import { ViajeCrearComponent } from './viajecrear/viajecrear.component';
// import { ViajeDetalleComponent } from './viajedetalle/viajedetalle.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ViajeComponent },
        {path: 'viajecrear', component: ViajeCrearComponent},
        { path: 'viajeeditar', component: ViajeEditarComponent },
        // { path: 'viajedetalle', component: ViajeDetalleComponent },
    ])],
    exports: [RouterModule]
})
export class ViajeRoutingModule { }
