import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ColaboradorComponent } from './colaborador.component';
import { ColaboradorEditarComponent } from './colaboradoreditar/colaboradoreditar.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ColaboradorComponent },
        { path: 'colaboradoreditar', component: ColaboradorEditarComponent },
    ])],
    exports: [RouterModule]
})
export class ColaboradorRoutingModule { }
