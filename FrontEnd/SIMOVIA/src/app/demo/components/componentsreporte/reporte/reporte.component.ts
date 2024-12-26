import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { transportista } from 'src/app/demo/models/modelsviaje/transportistaviewmodel';
import { transportistaService } from 'src/app/demo/services/servicesviaje/transportista.service';
import { viajeService } from 'src/app/demo/services/servicesviaje/viajeencabezado.service';
import { Reporte } from 'src/app/demo/models/modelsviaje/reporteviajeviewmodel';
import { Subscription } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { reporteService } from 'src/app/demo/services/servicesviaje/reporteviaje.service';
@Component({
    selector: 'reporte-reporte',
    templateUrl: './reporte.component.html',
})
export class ReporteComponent implements OnInit {
    tranId: number | null = null;
    inicio: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1); 
    fin: Date = new Date(); // Fecha actual
    transportistas: any[] = [];
    filtradoTransportistas: any[] = [];
    seleccionadoTransportista: any;    
    cargando: boolean = false;
    reporteData: Reporte[] = [];

    usuario:string='';
    persona:string='';
    @ViewChild('pdfViewer', { static: false }) pdfViewer!: ElementRef;

    constructor(
        private transportistaService: transportistaService,
        private viajeService: viajeService,
        private reporteService: reporteService
    ) {}

    ngOnInit(): void {
        const usuarioRegistrado = sessionStorage.getItem('usuario');
        const usuarioParseado = JSON.parse(usuarioRegistrado);
        this.usuario = usuarioParseado.usuario;
        const colaboradorRegistrado = sessionStorage.getItem('colaborador');
        const colaboradorParseado = JSON.parse(colaboradorRegistrado);
        this.persona = colaboradorParseado.colaborador;
        this.cargando = true;
        

        this.transportistaService.Listar().subscribe((response) =>{
            this.transportistas = response;
            this.cargando = false;
        });
    }

    seleccionandoTransportista(tranId: number) {
        this.tranId = tranId;
        this.cargarReporte();
    }

    seleccionandoFecha(tipo: string, event: Date) {
        if (tipo === 'inicio') {
            this.inicio = event;
        } else if (tipo === 'fin') {
            this.fin = event;
        }
        this.cargarReporte();
    }

     
    filtroTransportista(event: any) {
        const query = event.query.toLowerCase();
        this.filtradoTransportistas = this.transportistas.filter((transportista) =>
            transportista.tran_Nombre.toLowerCase().includes(query)
        );
    }

    limpiarTransportista() {
        this.seleccionadoTransportista = null;
    }
    

    cargarReporte() {
        if (this.tranId && this.inicio && this.fin) {
            this.cargando = true;
            const fechaInicio = this.formatoFecha(this.inicio);
            const fechaFin = this.formatoFecha(this.fin);
    
            this.reporteService.Reporte(this.seleccionadoTransportista.tran_Id, fechaInicio, fechaFin).subscribe({
                next: (response: any) => {
                    console.log('respond', response);
                    this.reporteData = response.detalle || []; 
                    this.mostrarPDF();
                    this.cargando = false;
                },
                error: () => {
                    console.error('Error al cargar el reporte');
                    this.cargando = false;
                },
            });
        }
    }
    
    

    mostrarPDF() {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'letter'
        });
    
        doc.setProperties({
            title: 'Reporte de Viajes',
            subject: 'Reporte agrupado por viaje',
            author: 'Sistema de Transporte',
            keywords: 'viajes, transportista, sucursales',
            creator: 'Sistema de Transporte'
        });
    
        const logoURL = 'assets/layout/images/SIMOVIA2.png'; 
        const imgWidth = 80;
        const imgHeight = 50;
        const pageWidth = doc.internal.pageSize.getWidth();
        const centerX = pageWidth / 2;
    
        doc.setDrawColor('#757d92'); 
        doc.setLineWidth(2);
        doc.rect(10, 10, pageWidth - 20, doc.internal.pageSize.getHeight() - 20);
    
        doc.setFontSize(16);
        doc.setTextColor('#757d92'); 
        doc.setFont(undefined, 'bold');
        doc.text('Reporte de Viajes', centerX, 40, { align: 'center' });
    
        const logoY = 50; 
        doc.addImage(logoURL, 'JPEG', centerX - imgWidth / 2, logoY, imgWidth, imgHeight);
    
        const textStartY = logoY + imgHeight + 10;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(
            `Viajes entre: ${this.formatoFecha(this.inicio)} - ${this.formatoFecha(this.fin)}`,
            30,
            textStartY + 15
        );
    
        doc.setFontSize(11);
        doc.setTextColor('#757d92'); 
        doc.text('Transportista seleccionado:', 30, textStartY + 30);
    
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(this.seleccionadoTransportista?.tran_Nombre || 'Sin nombre', 140, textStartY + 30);
    
        const groupedData = this.agruparPor(this.reporteData, 'vien_Id');
    
        let startY = textStartY + 50;
        Object.keys(groupedData).forEach((vien_Id) => {
            const viajes = groupedData[vien_Id];
            const viaje = viajes[0];
    
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'bold');
            doc.text(`Codigo: ${vien_Id}`, 30, startY);
            doc.text(`Fecha: ${viaje.vien_Fecha}`, 30, startY + 10);
            doc.text(`Sucursal: ${viaje.sucursal}`, 30, startY + 20);
            doc.text(`Transportista: ${viaje.transportista}`, 30, startY + 30);
            doc.text(`Distancia Total (km): ${viaje.vien_DistanciaTotalkm}`, 30, startY + 40);
            doc.text(`Tarifa del Transportista: ${viaje.vien_TarifaTransportista}`, 30, startY + 50);
            doc.text(`Total: ${viaje.vien_Total}`, 30, startY + 60);
    
            startY += 80;
    
            autoTable(doc, {
                startY,
                head: [['ID', 'Colaborador', 'Distancia (km)', 'Fecha de creación']],
                body: viajes.map((item) => [
                    item.vide_Id || 'Sin ID',
                    item.colaborador || 'Sin colaborador',
                    item.cosu_Distanciakm || '0.00',
                    item.vien_FechaCreacion || 'Sin fecha'
                ]),
                styles: { fontSize: 10 },
                headStyles: {
                    fillColor: [117, 125, 146], 
                    textColor: [255, 255, 255],
                    halign: 'center',
                    valign: 'middle',
                    fontStyle: 'bold'
                },
                theme: 'grid',
        didDrawPage: (data) => {
            const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

            doc.setFontSize(10);
            doc.text(`Emitido por: ${this.persona}`,data.settings.margin.left, pageHeight - 40);
            doc.text(`Fecha emitida: ${formattedDate}`, data.settings.margin.left, pageHeight - 30);
            doc.text(`Página ${data.pageNumber}`, data.settings.margin.left, pageHeight - 20);
        }
            });
    
            startY = (doc as any).autoTable.previous.finalY + 20;
        });
    
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
    
        setTimeout(() => {
            if (this.pdfViewer?.nativeElement) {
                this.pdfViewer.nativeElement.src = pdfUrl;
            } else {
                console.error('El iframe no está disponible para mostrar el PDF.');
            }
        }, 0);
    }
    
    agruparPor(array: any[], key: string) {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    }
        

    formatoFecha(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
