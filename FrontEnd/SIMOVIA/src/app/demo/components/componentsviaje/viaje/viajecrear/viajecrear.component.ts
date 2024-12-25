import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { sucursal } from 'src/app/demo/models/modelsviaje/sucursalviewmodel';
import { sucursalService } from 'src/app/demo/services/servicesviaje/sucursal.service';
import { colaborador } from 'src/app/demo/models/modelsgeneral/colaboradorviewmodel';
import { colaboradorService } from 'src/app/demo/services/servicesgeneral/colaborador.service';
import { colaboradorPorSucursalService } from 'src/app/demo/services/servicesviaje/colaboradorporsucursal.service';
import { transportistaService } from 'src/app/demo/services/servicesviaje/transportista.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { viajeService } from 'src/app/demo/services/servicesviaje/viajeencabezado.service';
import { Table } from 'primeng/table';
import { colaboradoresPorSucursal, colaboradorPorSucursal } from 'src/app/demo/models/modelsviaje/colaboradorporsucursalviewmodel';
import { viajeDetalleService } from 'src/app/demo/services/servicesviaje/viajedetalle.service';
import { viajeDetalle } from 'src/app/demo/models/modelsviaje/viajedetalleviewmodel';
@Component({
    selector: 'acceso-colaborador-colaboradordetalle',
    templateUrl: './viajecrear.component.html',
    styleUrls: ['./viajecrear.component.scss'],
    providers: [MessageService]
})
export class ViajeCrearComponent implements OnInit {
    viajeCrearForm: FormGroup; 

    sucursalesColaborador: sucursal[] = []; // Sucursales asociados al colaborador

    enviado:boolean =false;

    colaboradores: colaboradoresPorSucursal[] = [];
    colaboradoresFiltrados: colaboradoresPorSucursal[] = [];
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
    distanciaMaxima: number =100;
    totalPagar: number = 0;

    habilitarSeleccionColaboradores: boolean = false; // Controla si se puede seleccionar colaboradores

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
        this.viajeCrearForm = this.fb.group({
            vien_Fecha: [null, [Validators.required]],
            vien_DistanciaTotalkm: [null],
            vien_Total: [null],
            sucu_Id: [null, [Validators.required]],
            tran_Id: [null, [Validators.required]],
            vien_UsuarioCreacion: [null]
        })
    }

    ngOnInit(): void {
        this.cargarViajes();
        //AUTOCOMPLETES
        this.sucursalService.Listar().subscribe((response) => {
            this.sucursales = response.sort((a: any, b: any) =>
                a.sucu_Descripcion.localeCompare(b.carg_Descripcion)
            ); // ordenar por la descripcion
        });
        this.transportistaService.Listar().subscribe((response) =>{
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

    seleccionarFecha(event: any): void {
        const fechaSeleccionada = event; // Fecha seleccionada del calendario
        if (!fechaSeleccionada) {
            this.habilitarSeleccionColaboradores = false;
            return;
        }
        this.viajeCrearForm.controls['vien_Fecha'].setValue(fechaSeleccionada); // Actualizar el formulario
        this.verificarHabilitacionColaboradores(); // Verificar habilitación después de seleccionar la fecha
    
        // Formatear la fecha seleccionada en el formato
        const fechaFormato = new Date(fechaSeleccionada).toISOString().split('T')[0];
    
        // Buscar si hay viajes existentes en la fecha seleccionada
        const viajesEnFecha = this.viajes.filter(
            (viaje) => viaje.vien_Fecha?.split('T')[0] === fechaFormato
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
            this.colaboradores = this.colaboradoresFiltrados;
            // Si no hay viajes en esa fecha, no filtrar colaboradores
            console.log('No hay viajes en la fecha seleccionada.');
        }
    }
    
    
    seleccionarTransportista(event: any): void {
        const tarifa = event?.value.tran_Tarifa || 0; // Obtener la tarifa
        this.transportistaTarifa = tarifa; 

        this.viajeCrearForm.controls['tran_Id'].setValue(event?.value.tran_Id); // Actualizar el formulario
        this.verificarHabilitacionColaboradores(); // Verificar habilitación después de seleccionar transportista

        // Formatear solo para la vista, opcional
        const tarifaFormateada = tarifa.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
        console.log('Tarifa formateada:', tarifaFormateada);
    }
    
    verificarHabilitacionColaboradores(): void {
        const sucursalSeleccionada = this.viajeCrearForm.get('sucu_Id')?.value;
        const fechaSeleccionada = this.viajeCrearForm.get('vien_Fecha')?.value;
        const transportistaSeleccionado = this.viajeCrearForm.get('tran_Id')?.value;
    
        this.habilitarSeleccionColaboradores =
            sucursalSeleccionada && fechaSeleccionada && transportistaSeleccionado;
    }
    
    seleccionandoColaborador(event: any): void {
        const distanciaSeleccionada = event.data.cosu_Distanciakm || 0;
    
        // Verificar si al sumar la distancia seleccionada se supera el máximo permitido
        if (this.distanciaTotal + distanciaSeleccionada > this.distanciaMaxima) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'La distancia total no puede superar el límite de 100.',
                life: 3000
            });
            return; // No permite seleccionar este colaborador
        }
    
        this.distanciaTotal += distanciaSeleccionada;
    
        // Actualizar el estado de habilitación de los colaboradores
        this.actualizarHabilitacionColaboradores();
        this.calcularTotalPagar(); 

    }
    
    deseleccionandoColaborador(event: any): void {
        const distanciaDeseleccionada = event.data.cosu_Distanciakm || 0;
    
        // Asegurarse de que distanciaTotal no sea negativa
        this.distanciaTotal = Math.max(0, this.distanciaTotal - distanciaDeseleccionada);
    
        // Actualizar el estado de habilitación de los colaboradores
        this.actualizarHabilitacionColaboradores();
        this.calcularTotalPagar(); 
    }

    
    seleccionandoTodosColaboradores(event: any): void {
        if (event.checked) {
            let sumaDistancias = 0;
            const nuevosSeleccionados = []; // Lista temporal para almacenar los seleccionados válidos
    
            // Iterar sobre los colaboradores
            this.colaboradores.forEach(colaborador => {
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
            this.colaboradores.forEach(colaborador => (colaborador['deshabilitado'] = false));
    
            // Calcular el total a pagar
            this.calcularTotalPagar();
        }
    }
    

    calcularTotalPagar(): void {
        this.totalPagar = this.distanciaTotal * this.transportistaTarifa;
    }
    
    
    
    actualizarHabilitacionColaboradores(): void {
        this.colaboradores.forEach(colaborador => {
            const estaSeleccionado = this.colaboradoresSeleccionados.some(
                seleccionado => seleccionado.cola_Id === colaborador.cola_Id
            );
    
            // Deshabilitar si seleccionar este colaborador haría que la distancia supere el límite
            if (!estaSeleccionado && (this.distanciaTotal + (colaborador.cosu_Distanciakm || 0) > this.distanciaMaxima)) {
                colaborador['deshabilitado'] = true;
            } else {
                colaborador['deshabilitado'] = false;
            }
        });
    }
    
    seleccionarSucursal(sucursal: any): void {
        this.seleccionadoSucursal = sucursal.value;
        const sucursalId = sucursal?.value.sucu_Id;

        // Limpiar colaboradores seleccionados, distancia total y total a pagar
        this.colaboradoresSeleccionados = [];
        this.distanciaTotal = 0;
        this.totalPagar = 0;
    
        if (sucursalId) {
        this.viajeCrearForm.controls['sucu_Id'].setValue(sucursalId); // Actualizar el formulario

            this.colaboradorPorSucursalService.Listar(sucursalId).subscribe({
                next: (colaboradoresPorSucursal: any[]) => {
                    // Transforma los datos recibidos al modelo
                    this.colaboradoresFiltrados = colaboradoresPorSucursal.map(colaborador => ({
                        codigo: colaborador.codigo,
                        cola_Id: colaborador.cola_Id,
                        cola_DNI: colaborador.cola_DNI,
                        colaborador: colaborador.colaborador,
                        cosu_Distanciakm: colaborador.cosu_Distanciakm || 0,
                        sucu_Id: colaborador.sucu_Id
                    }));
                    this.colaboradores = colaboradoresPorSucursal.map(colaborador => ({
                        codigo: colaborador.codigo,
                        cola_Id: colaborador.cola_Id,
                        cola_DNI: colaborador.cola_DNI,
                        colaborador: colaborador.colaborador,
                        cosu_Distanciakm: colaborador.cosu_Distanciakm || 0,
                        sucu_Id: colaborador.sucu_Id
                    }));
                    this.verificarHabilitacionColaboradores();

                },
                error: (err) => {
                    console.error('Error al cargar colaboradores por sucursal:', err);
                    this.colaboradores = []; // Limpia la tabla en caso de error
                }
            });
        } else {
            // Si no hay sucursal seleccionada, limpia la tabla
            this.colaboradores = [];
            this.colaboradoresFiltrados = [];
        }
    }
    
    
        
    //FILTROS AUTOCOMPLETES
    filtroSucursal(event: any) {
        const query = event.query.toLowerCase();
        this.filtradoSucursales = this.sucursales.filter((sucursal) =>
            sucursal.sucu_Descripcion.toLowerCase().includes(query)
        );
    }
    
    filtroTransportista(event: any) {
        const query = event.query.toLowerCase();
        this.filtradoTransportistas = this.transportistas.filter((transportista) =>
            transportista.tran_Nombre.toLowerCase().includes(query)
        );
    }

    //LIMPIAR AUTOCOMPLETES
    limpiarSucursal() {
        this.seleccionadoSucursal = null;
        this.habilitarSeleccionColaboradores = false;
        this.viajeCrearForm.controls['sucu_Id'].setValue(null);
        this.colaboradores = []; // Vaciar la tabla de colaboradores
        this.colaboradoresFiltrados = [];
    }
    
    limpiarTransportista() {
        this.seleccionadoTransportista = null;
        this.habilitarSeleccionColaboradores = false;
        this.viajeCrearForm.controls['tran_Id'].setValue(null);
    }
    
    cancelar() {
        this.enviado=false;
        this.viajeCrearForm.reset();
        this.colaboradoresSeleccionados = [];
        this.seleccionadoSucursal = null;
        this.seleccionadoTransportista =null;
        this.colaboradorService.limpiarId();
        this.router.navigate(['/viaje/viaje']);
    }
    
    asignarColaboradores(vien_Id: number): void {
        
        const viajeDetalle: viajeDetalle = {
            vien_Id, // Asignar el ID del encabezado recién insertado
            colaboradores: this.colaboradoresSeleccionados.map(colaborador => colaborador.cola_Id) // IDs de colaboradores seleccionados
        };
    
        // Realizar la petición al servicio
        this.viajeDetalleService.Insertar(viajeDetalle).subscribe({
            next: (colaboradorResponse) => {
                if (colaboradorResponse?.code === 200) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Viaje creado exitosamente.',
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
    
    guardar() {
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
    
            const formData = { ...this.viajeCrearForm.value };
            const fecha = new Date(formData.vien_Fecha).toISOString().split('T')[0];
            formData.vien_Fecha = fecha;

            formData.vien_UsuarioCreacion = 1;
            formData.vien_DistanciaTotalkm = this.distanciaTotal;
            formData.vien_Total = this.totalPagar;
            console.log(formData);
    
            this.viajeService.Insertar(formData).subscribe({
                next: (response) => {
                    if (response?.code === 200 && response?.success) {
                        const vienId = response.data.codeStatus; 
    
                        this.asignarColaboradores(vienId);
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
              table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
          }
}
