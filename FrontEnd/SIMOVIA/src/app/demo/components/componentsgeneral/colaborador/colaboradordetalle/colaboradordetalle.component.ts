import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { sucursal } from 'src/app/demo/models/modelsviaje/sucursalviewmodel';
import { sucursalService } from 'src/app/demo/services/servicesviaje/sucursal.service';
import { colaborador } from 'src/app/demo/models/modelsgeneral/colaboradorviewmodel';
import { colaboradorService } from 'src/app/demo/services/servicesgeneral/colaborador.service';
import { colaboradorPorSucursalService } from 'src/app/demo/services/servicesviaje/colaboradorporsucursal.service';
@Component({
    selector: 'acceso-colaborador-colaboradordetalle',
    templateUrl: './colaboradordetalle.component.html',
    styleUrls: ['../colaborador.component.scss']
})
export class ColaboradorDetalleComponent implements OnInit {

    colaId: number | null | undefined;
    colaborador: any; // Variable para guardar los detalles del colaborador
    sucursalesColaborador: sucursal[] = []; // Sucursales asociadas al colaborador

    cargando: boolean = false; // Para manejar un spinner de carga
    

    constructor(
        private sucursalService: sucursalService,
        private colaboradorPorSucursalService: colaboradorPorSucursalService,
        private colaboradorService: colaboradorService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.cargando = true;
    
        this.colaId = this.colaboradorService.obtenerId();
    
        if (this.colaId) {
            this.obtenerDetallesColaborador();
            this.cargarSucursalesPorColaborador();
        } 
    }

    cargarSucursalesPorColaborador() {
        this.sucursalService.Listar().subscribe({
            next: (sucursales: sucursal[]) => {
                this.colaboradorPorSucursalService.Buscar(this.colaId!).subscribe({
                    next: (sucursalesPorColaborador: any[]) => {
                        const sucursalesAsociadosIds = sucursalesPorColaborador.map(s => s.sucu_Id); // IDs de sucursales asociados al colaborador
                        this.sucursalesColaborador = sucursales.filter(sucursal => 
                            sucursalesAsociadosIds.includes(sucursal.sucu_Id)
                        );
                        console.log('sucursales cola', sucursalesAsociadosIds);
                        this.cargando = false;
                    },
                    error: () => {
                        console.error('Error al obtener sucursales por colaborador.');
                        this.cargando = false;
                    }
                });
            },
            error: () => {
                console.error('Error al listar todos los sucursales.');
                this.cargando = false;
            }
        });
    }
    
    regresar() {
        this.colaboradorService.limpiarId();
        this.router.navigate(['/general/colaborador']);
    }

    obtenerDetallesColaborador() {
        this.colaboradorService.Buscar(this.colaId!).subscribe({
            next: (colaborador: any) => {
                this.colaborador = colaborador;
                this.cargando = false;
            },
            error: () => {
                this.cargando = false;
            }
        });
    }
    
}
