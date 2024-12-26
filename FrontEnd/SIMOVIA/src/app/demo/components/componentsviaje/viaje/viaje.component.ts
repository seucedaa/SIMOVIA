import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { viaje } from 'src/app/demo/models/modelsviaje/viajeencabezadoviewmodel';
import { viajeService } from 'src/app/demo/services/servicesviaje/viajeencabezado.service';
@Component({
    selector: 'viaje-viaje',
    templateUrl: './viaje.component.html',
    styleUrls: ['./viaje.component.scss'],
    providers: [MessageService],
})
export class ViajeComponent implements OnInit {
    viajes: viaje[] = [];
    columnas: any[] = [];

    viajeSeleccionado: viaje | null = null; 
    eliminarViaje: boolean = false; 

    acciones: MenuItem[] = [];
    exportar:string = 'SIMOVIA - Viajes';

    cargando: boolean = false;


    constructor(
        private viajeService: viajeService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.viajeService.limpiarId();

        this.cargarViajes();
        this.columnas = [
            { field: 'codigo', header: 'No.' },
            { field: 'vien_DistanciaTotalkm', header: 'Distancia' },
            { field: 'transportista', header: 'Transportista' },
            { field: 'vien_Fecha', header: 'Fecha' },
            { field: 'sucursal', header: 'Sucursal' },
            { field: 'vien_Total', header: 'Total' },
        ];
        this.acciones = [
            { 
                label: 'Detalles', 
                icon: 'pi pi-eye', 
                command: () => this.detalleViaje(this.viajeSeleccionado!) 
            },
            { 
                label: 'Editar', 
                icon: 'pi pi-pencil', 
                command: () => this.editarViaje(this.viajeSeleccionado!) 
            },
            { 
                label: 'Eliminar', 
                icon: 'pi pi-trash', 
                command: () => this.modalEliminarViaje(this.viajeSeleccionado!) 
            }
        ]    
    }

    esViajeSeleccionado(viaje: viaje) {
        this.viajeSeleccionado = viaje;
    }

    cargarViajes() {
        this.cargando = true; // Mostrar el spinner
        this.viajeService.Listar().subscribe({
            next: (data) => {
                this.viajes = data;
            },
            error: (err) => {
                console.error('Error al cargar viajes:', err);
            },
            complete: () => {
                this.cargando = false; // Ocultar el spinner al finalizar la carga
            },
        });
    }
    

    detalleViaje(viaje: viaje) {
        this.viajeService.almacenarId(viaje.vien_Id!);
        this.router.navigate(['/SIMOVIA/viaje/viaje/viajedetalle']);
    }

    editarViaje(viaje: viaje) {
        this.viajeService.almacenarId(viaje.vien_Id!);
        this.router.navigate(['/SIMOVIA/viaje/viaje/viajeeditar']);
    }

    modalEliminarViaje(viaje: viaje) {
        this.viajeSeleccionado = viaje; 
        this.eliminarViaje = true; 
    }

    confirmarEliminarViaje() {
        console.log(this.viajeSeleccionado);
        if (!this.viajeSeleccionado) return;

        this.viajeService.Eliminar(this.viajeSeleccionado.vien_Id!).subscribe({
            next: (response) => {
                console.log(response);
                if (response?.code === 200 && response?.success) {
                    this.viajes = this.viajes.filter(
                        (viaje) => viaje.vien_Id !== this.viajeSeleccionado?.vien_Id
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Viaje eliminado exitosamente.',
                        life: 3000,
                    });
                } else if (response.code === 500 && response.message === 'Viaje ya en uso.') {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: 'El viaje está en uso y no puede ser eliminado.',
                        life: 3000,
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Algo salió mal. Comuníquese con un Administrador.',
                        life: 3000,
                    });
                }

                this.eliminarViaje = false;
                this.viajeSeleccionado = null;
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Algo salió mal. Comuníquese con un Administrador.',
                    life: 3000,
                });
                this.eliminarViaje = false;
                this.viajeSeleccionado = null;
            },
        });
    }

    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
