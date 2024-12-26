import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Producto } from 'src/app/demo/models/ProductoViewModel';
import { ReporteService } from 'src/app/demo/service/reporte.service';
import { SucursalService } from 'src/app/demo/service/sucursal.service';
import { Sucursal } from 'src/app/demo/models/SucursalViewModel';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';


interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './pvendidos.component.html',
    providers: [MessageService]
})

export class ReporteComponent implements OnInit {

    productos: Producto[] = [];
    subscription: Subscription;

    sucursales: Sucursal[] = [];
    sucursalid: any;
    inicio:any;
    fin:any;
    sucursa:any;

    sucursall:any;
    formattedInicio:any;
    formattedFin:any;
    sucursal: Sucursal;


    @ViewChild('pdfViewer', { static: false }) pdfViewer!: ElementRef;

    constructor(private layoutService: LayoutService,    private router: Router,
        private reporteService: ReporteService,
      private sucursalService: SucursalService, private messageService: MessageService) { 
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
             this.ngOnInit();
         });
     
     const today = new Date();
     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
     this.inicio = firstDayOfMonth;
     this.fin = today;}

     onSucursalChange(sucur_Id: any) {

        this.sucursalService.Details(Number(sucur_Id)).then(data => {
            console.log(data);
            this.sucursal = data;

            this.sucursall= this.sucursal.sucur_Descripcion;
        });
      
      console.log(this.sucursall);
      console.log(this.sucursalid);

      if(this.sucursalid == 0){
          this.todas();
      }else{
          this.cambio();
      }   
  }

    todas(){
        this.sucursall = 'Todas las sucursales';

      this.formattedInicio = this.formatDate(this.inicio);
      this.formattedFin = this.formatDate(this.fin);
  
      this.reporteService.getTodasProductos(this.formattedInicio,this.formattedFin).then(response => {
        if (response && response.success) {
            this.productos = response.data;

            if (this.productos && this.productos.length > 0) {
                console.log('Productos:', this.productos);
                this.generatePDF();
            } else {
              this.generatePDF();
            }
        } else {
            console.error('Error en la respuesta de la API:', response.message);
        }
    }).catch(error => {
        console.error('Error al obtener todos los productos:', error);
    });
    }

    cambio(){

        this.formattedInicio = this.formatDate(this.inicio);
        this.formattedFin = this.formatDate(this.fin);

      
      this.reporteService.getProductos(this.sucursalid,this.formattedInicio,this.formattedFin).then(response => {
        if (response && response.success) {
            this.productos = response.data;

            if (this.productos && this.productos.length > 0) {
                console.log('Productos:', this.productos);
                this.generatePDF();
            } else {
              this.generatePDF();
            }
        } 
    })
   }

    formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  }

  onFechaChange(type: string, event: any) {
    if (type === 'inicio') {
        this.inicio = event;
    } else if (type === 'fin') {
        this.fin = event;
    }
    this.cambio();
  }

     ngOnInit(){
        const usuariolog = sessionStorage.getItem('usuario');
        const logueado = JSON.parse(usuariolog);
        if(!logueado)
            {
                this.router.navigate(['/login']);

            }
        this.formattedInicio = this.formatDate(this.inicio);
        this.formattedFin = this.formatDate(this.fin);

      this.sucursalService.getList().then(data => {
        this.sucursales = data;
        
        this.sucursales = this.sucursales.map((sucursal: any) => ({
            sucur_Id: sucursal.sucur_Id,
            sucur_Descripcion: sucursal.sucur_Descripcion,
            sucursal_Titulo: `${sucursal.sucur_Id} - ${sucursal.sucur_Descripcion}` 
        }));
    
        this.sucursales.unshift({ sucur_Id: 0, sucur_Descripcion: 'Mostrar todas' });

        const usuarioJson = sessionStorage.getItem('usuario');
        const usuario = JSON.parse(usuarioJson);
        this.sucursa = usuario.sucur_Id;

        const sucursalUsuario = this.sucursales.find(s => s.sucur_Id === this.sucursa);
        if (sucursalUsuario) {
            this.sucursall = sucursalUsuario.sucur_Descripcion;
            this.sucursalid = sucursalUsuario.sucur_Id;
        } 

        this.reporteService.getProductos(this.sucursa,this.formattedInicio,this.formattedFin).then(response => {


          if (response && response.success) {
              this.productos = response.data;
  
              if (this.productos && this.productos.length > 0) {
                  console.log('Productos:', this.productos);
                  this.generatePDF();
              } else {
                this.generatePDF();

              }
          } 
      })
    });

   
    }

    generatePDF() {
      const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: 'letter'
      });

      doc.setProperties({
        title: 'Ventas de Productos',
        subject: 'Reporte de ventas de productos',
        author: 'Supermercado La Colonia',
        keywords: 'ventas, productos, supermercado',
        creator: 'Supermercado La Colonia'
    });

      const logoURL = 'assets/layout/images/lacolonia/manzana.png';  
      const imgWidth = 80;  
      const imgHeight = 80; 
      const productosVendidos = this.productos.reduce((total, producto) => total + parseInt(producto.cantidad), 0);
      const usuarioJson = sessionStorage.getItem('usuario');
      const usuario = JSON.parse(usuarioJson);
      const persona = usuario.perso_NombreCompleto;

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setDrawColor('#40a72e');
      doc.setLineWidth(2);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      const centerX = pageWidth / 2;

      const logoX = 100;  
      const textX = logoX + imgWidth + 10;  
      const textY = 50;  

      doc.addImage(logoURL, 'JPEG', logoX, textY - imgHeight / 2, imgWidth, imgHeight);

      doc.setFontSize(16);
      doc.setTextColor(64, 167, 46);
      doc.setFont(undefined, 'bold');
      doc.text('SUPERMERCADO LA COLONIA', 170, textY);

      doc.setFontSize(12);
      doc.setTextColor(239, 91, 49);
      doc.setFont(undefined, 'normal');
      doc.text('Paga menos vive mejor', 170, textY + 15);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      doc.text('Escribenos: servicioalcliente@lacolonia.com', 30, 120);
      doc.text('Servicio al cliente: (+504) 2216-1950', 30, 130);
      doc.text('Oficinas corporativas: (+504) 2216-1900', 30, 140);
      doc.text('Horario de atención en línea: 8:00 A.M. A 8:00 P.M.', 30, 150);

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Ventas de Productos',centerX, 100, { align: 'center' });

      doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(64, 167, 46);
        doc.text('Sucursal: ', 30, 170);
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`${this.sucursall}`, 70, 170);

        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(64, 167, 46);
        doc.text('Fechas: ', 30, 180);
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`${this.formattedInicio} - ${this.formattedFin}`, 70, 180);


        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(64, 167, 46);
        doc.text('Productos Vendidos', pageWidth - 120, 120);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(productosVendidos.toString(), pageWidth - 40, 130);

      let proveedor = 'No hay productos';
    if (this.productos.length > 0) {
        const proveedorCount = this.productos.reduce((acc, producto) => {
            acc[producto.prove_Marca] = (acc[producto.prove_Marca] || 0) + 1;
            return acc;
        }, {});

        proveedor = Object.keys(proveedorCount).reduce((a, b) => proveedorCount[a] > proveedorCount[b] ? a : b);
    }

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(64, 167, 46);
        doc.text('Proveedor mas Vendido', pageWidth - 133, 150);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(proveedor.toString(), pageWidth - 100, 160);

      autoTable(doc, {
          head: [['Código', 'Descripción', 'Precio Venta', 'Cantidad', 'Proveedor', 'Categoría', 'Sub-Categoría']],
          body: this.productos.map(producto => [
              producto.produ_Id,
              producto.produ_Descripcion,
              producto.produ_PrecioVenta,
              producto.cantidad,
              producto.prove_Marca,
              producto.categ_Descripcion,
              producto.subca_Descripcion
          ]),
          startY: 190,
          styles: {
              font: 'helvetica',
              fontSize: 10,
          },
          headStyles: {
              fillColor: [64, 167, 46],
              textColor: [255, 255, 255],
              halign: 'center',
              valign: 'middle',
              fontStyle: 'bold',
          },
          theme: 'grid',
          didDrawPage: (data) => {
              const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
              const currentDate = new Date();
              const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

              doc.setFontSize(10);
              doc.text(`Emitido por: ${persona}`,data.settings.margin.left, pageHeight - 40);
              doc.text(`Fecha emitida: ${formattedDate}`, data.settings.margin.left, pageHeight - 30);
              doc.text(`Página ${data.pageNumber}`, data.settings.margin.left, pageHeight - 20);
          }
      });

      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      this.pdfViewer.nativeElement.src = pdfUrl;
  }

}