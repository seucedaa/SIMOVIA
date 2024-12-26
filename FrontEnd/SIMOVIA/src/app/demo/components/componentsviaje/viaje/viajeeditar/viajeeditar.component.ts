import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { sucursal } from 'src/app/demo/models/modelsviaje/sucursalviewmodel';
import { sucursalService } from 'src/app/demo/services/servicesviaje/sucursal.service';
import { colaboradorService } from 'src/app/demo/services/servicesgeneral/colaborador.service';
import { colaboradorPorSucursalService } from 'src/app/demo/services/servicesviaje/colaboradorporsucursal.service';
import { transportistaService } from 'src/app/demo/services/servicesviaje/transportista.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { viajeService } from 'src/app/demo/services/servicesviaje/viajeencabezado.service';
import { Table } from 'primeng/table';
import {
    colaboradoresPorSucursal,
    colaboradorPorSucursal,
} from 'src/app/demo/models/modelsviaje/colaboradorporsucursalviewmodel';
import { viajeDetalleService } from 'src/app/demo/services/servicesviaje/viajedetalle.service';
import { viajeDetalle } from 'src/app/demo/models/modelsviaje/viajedetalleviewmodel';
@Component({
    selector: 'viaje-viaje-viajedetalle',
    templateUrl: './viajeeditar.component.html',
    styleUrls: ['./viajeeditar.component.scss'],
    providers: [MessageService],
})
export class ViajeEditarComponent implements OnInit {
    viajeEditarForm: FormGroup;

    vienId: number | null | undefined;
    cargando: boolean = false;

    colaboradoresViaje: sucursal[] = []; // Sucursales asociados al colaborador

    enviado: boolean = false;

    colaboradores: colaboradoresPorSucursal[] = [];
    colaboradoresSeleccionados: colaboradorPorSucursal[] = [];

    // AUTOCOMPLETES
    sucursales: any[] = []; // Lista original de cargos
    filtradoSucursales: any[] = []; // Lista filtrada para autocomplete
    seleccionadoSucursal: any; // Departamento seleccionado
    //continuacion autocompletes:
    transportistas: any[] = [];
    filtradoTransportistas: any[] = [];
    seleccionadoTransportista: any;

    //FECHAS
    fechaMinima!: Date;
    fechaMaxima!: Date;
    anioRango!: string;

    viajes: any[] = [];
    transportistaTarifa: number | null = null;
    distanciaTotal: number = 0;
    distanciaMaxima: number = 100;
    totalPagar: number = 0;

    private cargasPendientes: number = 0;

    constructor(
        private sucursalService: sucursalService,
        private transportistaService: transportistaService,
        private colaboradorPorSucursalService: colaboradorPorSucursalService,
        private colaboradorService: colaboradorService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private viajeService: viajeService,
        private viajeDetalleService: viajeDetalleService
    ) {
        this.viajeEditarForm = this.fb.group({
            vien_Fecha: [{ value: '', disabled: true }], // Inicializado como deshabilitado
            vien_DistanciaTotalkm: [null],
            vien_Total: [null],
            sucu_Id: [null, [Validators.required]],
            tran_Id: [null, [Validators.required]],
            vien_UsuarioModificacion: [null],
        });
    }

    ngOnInit(): void {
        this.cargando = true;
        this.vienId = this.viajeService.obtenerId();
        console.log(this.vienId);
        this.cargarViajes();
        //AUTOCOMPLETES
        this.sucursalService.Listar().subscribe((response) => {
            this.sucursales = response.sort((a: any, b: any) =>
                a.sucu_Descripcion.localeCompare(b.carg_Descripcion)
            ); // ordenar por la descripcion
        });
        this.transportistaService.Listar().subscribe((response) => {
            this.transportistas = response;
            console.log(response);
        });

        //RANGO PARA FECHA DE NACIMIENTO
        const anioActual = new Date().getFullYear();
        const fechaActual = new Date(); // Fecha actual

        // Establecer fecha mínima y máxima
        this.fechaMinima = new Date(anioActual - 20, 0, 1);
        this.fechaMaxima = new Date(anioActual, 11, 31); // Mes 11 es diciembre, día 31

        // Rango de años para el selector de años
        this.anioRango = `${anioActual - 20}:${anioActual - 20}`;

        if (this.vienId) {
            this.cargarEncabezado(); // Cargar datos del encabezado
            this.seleccionarColaboradores();
        } else {
            this.checkCargaCompleta();
        }
    }

    private iniciarCarga(): void {
        this.cargasPendientes++;
    }

    private finalizarCarga(): void {
        this.cargasPendientes--;
        this.checkCargaCompleta();
    }

    private checkCargaCompleta(): void {
        if (this.cargasPendientes === 0) {
            this.cargando = false; // Desactivar el spinner
        }
    }

    cargarViajes(): void {
        this.viajeService.Listar().subscribe({
            next: (viajesRegistrados: any[]) => {
                this.viajes = viajesRegistrados; // Guardar todos los viajes
                console.log(this.viajes);
            },
            error: (err) => {
                console.error('Error al cargar los viajes:', err);
            },
        });
    }

    cargarEncabezado(): void {
        this.viajeService.Buscar(this.vienId).subscribe({
            next: (viaje: any) => {
                this.viajeEditarForm.patchValue({
                    vien_Fecha: new Date(viaje.vien_Fecha),
                    vien_DistanciaTotalkm: viaje.vien_DistanciaTotalkm,
                    vien_Total: viaje.vien_Total,
                    sucu_Id: viaje.sucu_Id,
                    tran_Id: viaje.tran_Id,
                });

                const interval = setInterval(() => {
                    // Asegurarse de que las listas esten cargadas
                    if (
                        this.sucursales.length > 0 &&
                        this.transportistas.length > 0
                    ) {
                        const sucursall = viaje.sucu_Id;
                        this.seleccionadoSucursal = this.sucursales.find(
                            (sucursal) => sucursal.sucu_Id === sucursall
                        );

                        // Seleccionar el transportista
                        const transportistaa = viaje.tran_Id;
                        this.seleccionadoTransportista =
                            this.transportistas.find(
                                (transportista) =>
                                    transportista.tran_Id === transportistaa
                            );
                    }
                }, 100);
                console.log('viaje', viaje);
                this.transportistaTarifa = viaje.vien_TarifaTransportista;
                this.distanciaTotal = viaje.vien_DistanciaTotalkm;
                this.totalPagar = viaje.vien_Total;
                this.filtrarColaboradoresPorSucursal(); // Filtrar colaboradores
            },
            complete: () => {
                this.checkCargaCompleta();
            },
        });
    }
    filtrarColaboradoresPorSucursal(): void {
        const sucursalId = this.viajeEditarForm.get('sucu_Id')?.value;
        const fechaSeleccionada = this.viajeEditarForm.get('vien_Fecha')?.value;
        console.log(sucursalId);
        console.log(fechaSeleccionada);

        this.colaboradorPorSucursalService.Listar(sucursalId).subscribe({
            next: (colaboradoresPorSucursal: any[]) => {
                this.colaboradores = colaboradoresPorSucursal.map(
                    (colaborador) => ({
                        codigo: colaborador.codigo,
                        cola_Id: colaborador.cola_Id,
                        cola_DNI: colaborador.cola_DNI,
                        colaborador: colaborador.colaborador,
                        cosu_Distanciakm: colaborador.cosu_Distanciakm || 0,
                        sucu_Id: colaborador.sucu_Id,
                    })
                );
                console.log('si');
                this.filtrarPorFecha(fechaSeleccionada);
            },
            error: (err) => {
                console.error(
                    'Error al cargar colaboradores por sucursal:',
                    err
                );
                this.colaboradores = []; // Limpia la tabla en caso de error
            },
        });
    }
    
    filtrarPorFecha(fechaSeleccionada: Date): void {
    
        const fechaFormato = new Date(fechaSeleccionada).toISOString().split('T')[0];
    
        // Filtra los viajes en la misma fecha (excluyendo el viaje actual)
        const viajesEnFecha = this.viajes.filter(
            (viaje) =>
                viaje.vien_Fecha?.split('T')[0] === fechaFormato &&
                viaje.vien_Id !== this.vienId // Excluye el viaje actual
        );
    
        if (viajesEnFecha.length > 0) {
            // Hay viajes en esta fecha, tomar el vien_Id
            const vienId = viajesEnFecha[0].vien_Id; // Tomamos el primer viaje encontrado
    
            // Consultar los colaboradores asociados a ese viaje
            this.viajeDetalleService.Buscar(vienId).subscribe({
                next: (detalles: any[]) => {
                    // Obtener los IDs de los colaboradores que ya hicieron un viaje
                    const colaboradoresConViaje = detalles.map((detalle) => detalle.cola_Id);
    
                    console.log('Colaboradores con viaje:', colaboradoresConViaje);
    
                    // Filtrar la tabla de colaboradores excluyendo estos IDs
                    this.colaboradores = this.colaboradores.filter(
                        (colaborador) => !colaboradoresConViaje.includes(colaborador.cola_Id)
                    );
    
                    console.log('Colaboradores filtrados:', this.colaboradores);
                },
                error: (err) => {
                    console.error('Error al obtener detalles del viaje:', err);
                },
            });
        } else {
            // Si no hay viajes en esa fecha, no filtrar colaboradores
            console.log('No hay viajes en la fecha seleccionada.');
        }
    }
    

    seleccionarColaboradores(): void {
        if (!this.vienId) return;

        this.iniciarCarga(); // Activar spinner al inicio

        // Usar un intervalo para esperar hasta que los colaboradores carguen
        const interval = setInterval(() => {
            if (this.colaboradores.length > 0) {
                // Asegurarse de que la lista de colaboradores este disponible
                clearInterval(interval); // Detener el reintento
                this.viajeDetalleService.Buscar(this.vienId).subscribe({
                    next: (detalles: any[]) => {
                        detalles.forEach((detalle) => {
                            const colaborador = this.colaboradores.find(
                                (c) => c.cola_Id === detalle.cola_Id
                            );
                            console.log(colaborador);
                            if (colaborador) {
                                if (
                                    !this.colaboradoresSeleccionados.includes(
                                        colaborador
                                    )
                                ) {
                                    this.colaboradoresSeleccionados = [
                                        ...this.colaboradoresSeleccionados,
                                        colaborador,
                                    ];
                                }
                            }
                        });
                    },
                    complete: () => {
                        this.finalizarCarga(); // Desactivar spinner cuando todo termine
                    },
                });
            }
        }, 100); // Verificar cada 100ms
    }

    seleccionandoColaborador(event: any): void {
        const distanciaSeleccionada = event.data.cosu_Distanciakm || 0;

        // Verificar si al sumar la distancia seleccionada se supera el máximo permitido
        if (
            this.distanciaTotal + distanciaSeleccionada >
            this.distanciaMaxima
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'La distancia total no puede superar el límite de 100.',
                life: 3000,
            });
            return; // No permite seleccionar este colaborador
        }

        this.distanciaTotal += distanciaSeleccionada;

        // Actualizar el estado de habilitación de los colaboradores
        this.actualizarHabilitacionColaboradores();
        this.calcularTotalPagar(); // Recalcular total a pagar
    }

    deseleccionandoColaborador(event: any): void {
        const distanciaDeseleccionada = event.data.cosu_Distanciakm || 0;

        // Asegurarse de que distanciaTotal no sea negativa
        this.distanciaTotal = Math.max(
            0,
            this.distanciaTotal - distanciaDeseleccionada
        );

        // Actualizar el estado de habilitación de los colaboradores
        this.actualizarHabilitacionColaboradores();
        this.calcularTotalPagar(); // Recalcular total a pagar
    }

    seleccionandoTodosColaboradores(event: any): void {
        if (event.checked) {
            let sumaDistancias = 0;
            const nuevosSeleccionados = []; // Lista temporal para almacenar los seleccionados válidos

            // Iterar sobre los colaboradores
            this.colaboradores.forEach((colaborador) => {
                const distancia = colaborador.cosu_Distanciakm || 0;

                if (sumaDistancias + distancia <= this.distanciaMaxima) {
                    sumaDistancias += distancia;
                    nuevosSeleccionados.push(colaborador); // Agregar a los seleccionados válidos
                    colaborador['deshabilitado'] = false; // Asegurar que esté habilitado
                } else {
                    colaborador['deshabilitado'] = true; // Deshabilitar si excede el límite
                }
            });

            // Actualizar la selección y la distancia total
            this.colaboradoresSeleccionados = [...nuevosSeleccionados];
            this.distanciaTotal = sumaDistancias;

            // Calcular el total a pagar
            this.calcularTotalPagar();

            // Limpiar cualquier checkbox marcado de forma incorrecta
            setTimeout(() => {
                this.colaboradoresSeleccionados = [...nuevosSeleccionados];
            }, 0); // Forzar a que PrimeNG actualice el estado visual
        } else {
            // Reiniciar si se deseleccionan todos
            this.distanciaTotal = 0;
            this.colaboradoresSeleccionados = []; // Limpiar la selección
            this.colaboradores.forEach(
                (colaborador) => (colaborador['deshabilitado'] = false)
            );

            // Calcular el total a pagar
            this.calcularTotalPagar();
        }
    }

    calcularTotalPagar(): void {
        this.totalPagar = this.distanciaTotal * this.transportistaTarifa;
    }

    actualizarHabilitacionColaboradores(): void {
        this.colaboradores.forEach((colaborador) => {
            const estaSeleccionado = this.colaboradoresSeleccionados.some(
                (seleccionado) => seleccionado.cola_Id === colaborador.cola_Id
            );

            // Deshabilitar si seleccionar este colaborador haría que la distancia supere el límite
            if (
                !estaSeleccionado &&
                this.distanciaTotal + (colaborador.cosu_Distanciakm || 0) >
                    this.distanciaMaxima
            ) {
                colaborador['deshabilitado'] = true;
            } else {
                colaborador['deshabilitado'] = false;
            }
        });
    }

    cancelar() {
        this.enviado = false;
        this.viajeEditarForm.reset();
        this.colaboradoresSeleccionados = [];
        this.seleccionadoSucursal = null;
        this.seleccionadoTransportista = null;
        this.colaboradorService.limpiarId();
        this.router.navigate(['/SIMOVIA/viaje/viaje']);
    }

    asignarColaboradores(vien_Id: number): void {
        const viajeDetalle: viajeDetalle = {
            vien_Id, // Asignar el ID del encabezado recién insertado
            colaboradores: this.colaboradoresSeleccionados.map(
                (colaborador) => colaborador.cola_Id
            ), // IDs de colaboradores seleccionados
        };

        // Realizar la petición al servicio
        this.viajeDetalleService.Actualizar(viajeDetalle).subscribe({
            next: (colaboradorResponse) => {
                if (colaboradorResponse?.code === 200) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Viaje actualizado exitosamente.',
                        life: 3000,
                    });

                    setTimeout(() => {
                        this.cancelar();
                    }, 500);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Algo salió mal. Comuníquese con un Administrador.',
                        life: 3000,
                    });
                }
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Algo salió mal. Comuníquese con un Administrador.',
                    life: 3000,
                });
            },
        });
    }

    actualizar() {
        this.enviado = true;
        if (!this.colaboradoresSeleccionados || this.colaboradoresSeleccionados.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar colaboradores.',
                life: 3000,
            });
            return; // Detiene
        }

        const formData = { ...this.viajeEditarForm.value };
        formData.vien_Id = this.vienId;
        formData.vien_UsuarioModificacion = 1;
        formData.vien_DistanciaTotalkm = this.distanciaTotal;
        formData.vien_Total = this.totalPagar;

        this.viajeService.Actualizar(formData).subscribe({
            next: (response) => {
                if (response?.code === 200 && response?.success) {

                    this.asignarColaboradores(this.vienId);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Algo salió mal. Comuníquese con un Administrador.',
                        life: 3000,
                    });
                }
            },
            error: (err) => {
                console.error('Error:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Algo salió mal. Comuníquese con un Administrador.',
                    life: 3000,
                });
            },
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
