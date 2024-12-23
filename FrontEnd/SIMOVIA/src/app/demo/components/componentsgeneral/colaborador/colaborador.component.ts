import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { colaborador } from 'src/app/demo/models/modelsgeneral/colaboradorviewmodel';
import { colaboradorService } from 'src/app/demo/services/servicesgeneral/colaborador.service';

@Component({
    selector: 'general-colaborador',
    templateUrl: './colaborador.component.html',
    styleUrls: ['./colaborador.component.scss'],
    providers: [MessageService],
})
export class ColaboradorComponent implements OnInit {
    colaboradores: colaborador[] = [];
    columnas: any[] = [];

    colaboradorSeleccionado: colaborador | null = null; 
    eliminarColaborador: boolean = false; 

    acciones: MenuItem[] = [];
    exportar:string = 'SIMOVIA - Colaboradores';

    constructor(
        private colaboradorService: colaboradorService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.colaboradorService.limpiarId();

        this.cargarColaboradores();
        this.columnas = [
            { field: 'codigo', header: 'No.' },
            { field: 'cola_DNI', header: 'DNI' },
            { field: 'colaborador', header: 'Colaborador' },
            { field: 'cola_CorreoElectronico', header: 'Correo Electrónico' },
            { field: 'cola_Telefono', header: 'Teléfono' },
        ];
        this.acciones = [
            { 
                label: 'Detalles', 
                icon: 'pi pi-eye', 
                command: () => this.detalleColaborador(this.colaboradorSeleccionado!) 
            },
            { 
                label: 'Editar', 
                icon: 'pi pi-pencil', 
                command: () => this.editarColaborador(this.colaboradorSeleccionado!) 
            },
            { 
                label: 'Eliminar', 
                icon: 'pi pi-trash', 
                command: () => this.modalEliminarColaborador(this.colaboradorSeleccionado!) 
            }
        ]    
    }

    esColaboradorSeleccionado(colaborador: colaborador) {
        this.colaboradorSeleccionado = colaborador;
    }

    cargarColaboradores() {
        this.colaboradorService.Listar().subscribe({
            next: (data) => {
                this.colaboradores = data;
            }
        });
    }

    detalleColaborador(colaborador: colaborador) {
        this.colaboradorService.almacenarId(colaborador.cola_Id!);
        this.router.navigate(['/general/colaborador/colaboradordetalle']);
    }

    editarColaborador(colaborador: colaborador) {
        this.colaboradorService.almacenarId(colaborador.cola_Id!);
        this.router.navigate(['/general/colaborador/colaboradoreditar']);
    }

    modalEliminarColaborador(colaborador: colaborador) {
        console.log('mostrar', colaborador);
        this.colaboradorSeleccionado = colaborador; 
        this.eliminarColaborador = true; 
    }

    confirmarEliminarColaborador() {
        console.log(this.colaboradorSeleccionado);
        if (!this.colaboradorSeleccionado) return;

        this.colaboradorService.Eliminar(this.colaboradorSeleccionado.cola_Id!).subscribe({
            next: (response) => {
                console.log(response);
                if (response?.code === 200 && response?.success) {
                    this.colaboradores = this.colaboradores.filter(
                        (colaborador) => colaborador.cola_Id !== this.colaboradorSeleccionado?.cola_Id
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Colaborador eliminado exitosamente.',
                        life: 3000,
                    });
                } else if (response.code === 500 && response.message === 'Colaborador ya en uso.') {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: 'El colaborador está en uso y no puede ser eliminado.',
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

                this.eliminarColaborador = false;
                this.colaboradorSeleccionado = null;
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Algo salió mal. Comuníquese con un Administrador.',
                    life: 3000,
                });
                this.eliminarColaborador = false;
                this.colaboradorSeleccionado = null;
            },
        });
    }

    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
