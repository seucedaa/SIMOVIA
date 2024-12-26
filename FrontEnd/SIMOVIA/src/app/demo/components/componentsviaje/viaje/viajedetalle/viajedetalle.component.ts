import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { sucursal } from 'src/app/demo/models/modelsviaje/sucursalviewmodel';
import { sucursalService } from 'src/app/demo/services/servicesviaje/sucursal.service';
import { viaje } from 'src/app/demo/models/modelsviaje/viajeencabezadoviewmodel';
import { viajeService } from 'src/app/demo/services/servicesviaje/viajeencabezado.service';
import { colaboradorPorSucursalService } from 'src/app/demo/services/servicesviaje/colaboradorporsucursal.service';
import { colaborador } from 'src/app/demo/models/modelsgeneral/colaboradorviewmodel';
import { colaboradorService } from 'src/app/demo/services/servicesgeneral/colaborador.service';
import { viajeDetalleService } from 'src/app/demo/services/servicesviaje/viajedetalle.service';
@Component({
    selector: 'viaje-viaje-viajedetalle',
    templateUrl: './viajedetalle.component.html',
    styleUrls: ['../viaje.component.scss']
})
export class ViajeDetalleComponent implements OnInit {

    vienId: number | null | undefined;
    viaje: any; // Variable para guardar los detalles del colaborador
    colaboradoresViaje: colaborador[] = []; // Colaboradores asociadas al viaje

    cargando: boolean = false; // Para manejar un spinner de carga
    

    constructor(
        private colaboradorService: colaboradorService,
        private viajeDetalleService: viajeDetalleService,
        private viajeService: viajeService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.cargando = true;
    
        this.vienId = this.viajeService.obtenerId();
    
        if (this.vienId) {
            this.obtenerDetallesViaje();
            this.cargarColaboradoresPorViaje();
        } 
    }

    cargarColaboradoresPorViaje() {
        this.colaboradorService.Listar().subscribe({
            next: (colaboradores: colaborador[]) => {
                this.viajeDetalleService.Buscar(this.vienId!).subscribe({
                    next: (colaboradoresPorViaje: any[]) => {
                        const colaboradoresAsociadosIds = colaboradoresPorViaje.map(c => c.cola_Id); // IDs de sucursales asociados al colaborador
                        this.colaboradoresViaje = colaboradores.filter(colaborador => 
                            colaboradoresAsociadosIds.includes(colaborador.cola_Id)
                        );
                        this.cargando = false;
                    }
                });
            }
        });
    }
    
    regresar() {
        this.viajeService.limpiarId();
        this.router.navigate(['/SIMOVIA/viaje/viaje']);
    }

    obtenerDetallesViaje() {
        this.viajeService.Buscar(this.vienId!).subscribe({
            next: (viaje: any) => {
                this.viaje = viaje;
                this.cargando = false;
            },
            error: () => {
                this.cargando = false;
            }
        });
    }
    
}
