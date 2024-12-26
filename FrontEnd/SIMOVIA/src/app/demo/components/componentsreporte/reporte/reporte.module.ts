import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ReporteComponent } from './reporte.component';
import { ReporteRoutingModule } from './reporte-routing.module';
import { CalendarModule } from "primeng/calendar";
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
	imports: [
		CommonModule,
		CalendarModule,
		ReporteRoutingModule,
		NgxExtendedPdfViewerModule,
		FormsModule,
		TableModule,
		RatingModule,
		ButtonModule,
		SliderModule,
		InputTextModule,
		ToggleButtonModule,
		RippleModule,
		MultiSelectModule,
		DropdownModule,
		ProgressBarModule,
		ToastModule,
        ProgressSpinnerModule,
		AutoCompleteModule
	],
	declarations: [ReporteComponent]
})
export class ReporteModule { }
