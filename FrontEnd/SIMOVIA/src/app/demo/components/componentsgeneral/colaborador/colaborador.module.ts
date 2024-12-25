import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColaboradorRoutingModule } from './colaborador-routing.module';
import { ColaboradorComponent } from './colaborador.component';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { SplitButtonModule } from 'primeng/splitbutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ColaboradorEditarComponent } from './colaboradoreditar/colaboradoreditar.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { ColaboradorCrearComponent } from './colaboradorcrear/colaboradorcrear.component';
import { TabViewModule } from 'primeng/tabview';
import { ColaboradorDetalleComponent } from './colaboradordetalle/colaboradordetalle.component';

@NgModule({
	imports: [
		CommonModule,
		ColaboradorRoutingModule,
		TableModule,
		FormsModule,
		ButtonModule,
		RippleModule,
		ToastModule,
		ToolbarModule,
		RatingModule,
		InputTextModule,
		InputTextareaModule,
		DropdownModule,
		RadioButtonModule,
		InputNumberModule,
		DialogModule,
		OverlayPanelModule,
		ConfirmDialogModule,
		SidebarModule,
		ConfirmPopupModule,
		ReactiveFormsModule,
		ProgressSpinnerModule,
		SplitButtonModule,
        AutoCompleteModule,
        CalendarModule,
        TabViewModule
	],
	declarations: [ColaboradorComponent, ColaboradorEditarComponent, ColaboradorCrearComponent, ColaboradorDetalleComponent]
})
export class ColaboradorModule { }