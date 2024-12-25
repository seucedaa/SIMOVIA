import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ColaboradorComponent } from './colaborador.component';
import { ColaboradorEditarComponent } from './colaboradoreditar/colaboradoreditar.component';
import { ColaboradorCrearComponent } from './colaboradorcrear/colaboradorcrear.component';
import { ColaboradorDetalleComponent } from './colaboradordetalle/colaboradordetalle.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ColaboradorComponent },
        {path: 'colaboradorcrear', component: ColaboradorCrearComponent},
        { path: 'colaboradoreditar', component: ColaboradorEditarComponent },
        { path: 'colaboradordetalle', component: ColaboradorDetalleComponent },
    ])],
    exports: [RouterModule]
})
export class ColaboradorRoutingModule { }
