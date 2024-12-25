import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService, TreeNode } from 'primeng/api';
import { Table } from 'primeng/table';
import { colaborador } from 'src/app/demo/models/modelsgeneral/colaboradorviewmodel';
import { departamento } from 'src/app/demo/models/modelsgeneral/departamentoviewmodel';
import { sucursal } from 'src/app/demo/models/modelsviaje/sucursalviewmodel';
import { cargoService } from 'src/app/demo/services/servicesgeneral/cargo.service';
import { colaboradorService } from 'src/app/demo/services/servicesgeneral/colaborador.service';
import { departamentoService } from 'src/app/demo/services/servicesgeneral/departamento.service';
import { estadoCivilService } from 'src/app/demo/services/servicesgeneral/estadocivil.service';
import { municipioService } from 'src/app/demo/services/servicesgeneral/municipio.service';
import { colaboradorPorSucursalService } from 'src/app/demo/services/servicesviaje/colaboradorporsucursal.service';
import { sucursalService } from 'src/app/demo/services/servicesviaje/sucursal.service';

@Component({
    selector: 'acceso-colaborador-colaboradoreditar',
    templateUrl: './colaboradoreditar.component.html',
    styleUrl: './colaboradoreditar.component.scss',
    providers: [MessageService],
})
export class ColaboradorEditarComponent implements OnInit {
    colaboradorEditarForm: FormGroup;

    routeItems: MenuItem[] = [];
    IndexTab: number = 0;

    enviadoPersonal: boolean = false;
    enviadoSucursales: boolean = false;

    camposPersonales = [
        'cola_DNI',
        'cola_CorreoElectronico',
        'cola_Nombres',
        'cola_Apellidos',
        'cola_Telefono',
        'cola_FechaNacimiento',
        'cola_Sexo',
        'civi_Id',
        'muni_Id',
        'carg_Id',
    ];

    colaId: number | null | undefined;
    cargando: boolean = false;

    colaboradores: colaborador[] = [];
    sucursales: sucursal[] = [];
    sucursalesSeleccionadas: sucursal[] = [];

    // AUTOCOMPLETES
    cargos: any[] = []; // Lista original de cargos
    filtradoCargos: any[] = []; // Lista filtrada para autocomplete
    seleccionadoCargo: any; // Departamento seleccionado
    //continuacion autocompletes:
    departamentos: any[] = [];
    filtradoDepartamentos: any[] = [];
    seleccionadoDepartamento: any;
    municipios: any[] = [];
    filtradoMunicipios: any[] = [];
    seleccionadoMunicipio: any;
    estadosCiviles: any[] = [];
    filtradoEstadosCiviles: any[] = [];
    seleccionadoEstadoCivil: any;

    //FECHAS
    fechaMinima!: Date;
    fechaMaxima!: Date;
    anioRango!: string;

    dniYaRegistrado: boolean = false;
    correoYaRegistrado: boolean = false;

    private cargasPendientes: number = 0;

    constructor(
        private colaboradorService: colaboradorService,
        private colaboradorPorSucursalService: colaboradorPorSucursalService,
        private sucursalService: sucursalService,
        private estadoCivilservice: estadoCivilService,
        private departamentoService: departamentoService,
        private municipioService: municipioService,
        private cargoService: cargoService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private router: Router
    ) {
        this.colaboradorEditarForm = this.fb.group({
            cola_DNI: [null, Validators.required],
            cola_Nombres: [
                null,
                [Validators.required, Validators.pattern('^[a-zA-ZñÑ\\s]+$')],
            ],
            cola_Apellidos: [
                null,
                [Validators.required, Validators.pattern('^[a-zA-ZñÑ\\s]+$')],
            ],
            cola_CorreoElectronico: [
                null,
                [
                    Validators.required,
                    Validators.pattern(
                        /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov)$/i
                    ),
                ],
            ],
            cola_Telefono: [null, [Validators.required]],
            cola_Sexo: ['F', [Validators.pattern('^[MF]$')]],
            cola_FechaNacimiento: [null, [Validators.required]],
            muni_Id: [null, [Validators.required]],
            civi_Id: [null, [Validators.required]],
            carg_Id: [null, [Validators.required]],
            cola_UsuarioModificacion: [null],
        });
    }

    ngOnInit(): void {
        this.cargando = true;
        this.colaId = this.colaboradorService.obtenerId();

        this.cargarSucursales();
        this.seleccionarSucursales();
        this.cargarColaboradores();
        this.cargarAutocompletes();

        //RANGO PARA FECHA DE NACIMIENTO
        const anioActual = new Date().getFullYear();
        const fechaActual = new Date();

        // Establecer fecha minima y maxima
        this.fechaMinima = new Date(anioActual - 80, 0, 1); // 80 años atas (1 de enero)
        this.fechaMaxima = new Date(
            anioActual,
            fechaActual.getMonth(),
            fechaActual.getDate()
        );

        // Rango de años para el selector de años
        this.anioRango = `${anioActual - 80}:${anioActual - 80}`;

        if (this.colaId) {
            this.colaboradorService.Buscar(this.colaId).subscribe({
                next: (colaborador: any) => {
                    console.log(colaborador);
                    this.colaboradorEditarForm.patchValue({
                        cola_DNI: colaborador.cola_DNI,
                        cola_Nombres: colaborador.cola_Nombres,
                        cola_Apellidos: colaborador.cola_Apellidos,
                        cola_CorreoElectronico:
                            colaborador.cola_CorreoElectronico,
                        cola_Telefono: colaborador.cola_Telefono,
                        cola_Sexo: colaborador.cola_Sexo,
                        cola_FechaNacimiento: new Date(
                            colaborador.cola_FechaNacimiento
                        ), // Convertir fecha
                        muni_Id: colaborador.muni_Id,
                        civi_Id: colaborador.civi_Id,
                        carg_Id: colaborador.carg_Id,
                    });

                    this.seleccionarValoresAutocompletes(colaborador);
                },
                complete: () => {
                    this.checkCargaCompleta();
                },
            });
        }
        else {
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

    cargarSucursales() {
        this.iniciarCarga();
        this.sucursalService.Listar().subscribe({
            next: (data) => {
                this.sucursales = data;
                console.log(this.sucursales);
            },
            complete: () => {
                this.finalizarCarga();
            },
        });
    }

    seleccionarSucursales(): void {
        if (!this.colaId) return;
    
        this.iniciarCarga(); // Activar spinner al inicio
    
        // Usar un intervalo para esperar hasta que las sucursales carguen
        const interval = setInterval(() => {
            if (this.sucursales.length > 0) { // Asegurarse de que la lista de sucursales este disponible
                clearInterval(interval); // Detener el reintento
    
                this.colaboradorPorSucursalService.Buscar(this.colaId).subscribe({
                    next: (sucursalesColaborador: any[]) => {
                        console.log('Sucursales del colaborador:', sucursalesColaborador);
    
                        // Iterar sobre las sucursales del colaborador
                        sucursalesColaborador.forEach((sucursalColaborador) => {
                            // Encontrar la sucursal en la lista completa
                            const sucursal = this.sucursales.find(
                                (s) => s.sucu_Id === sucursalColaborador.sucu_Id
                            );
    
                            if (sucursal) {
                                // Actualizar los valores de distancia y habilitacion
                                sucursal.distancia = sucursalColaborador.cosu_Distanciakm;
                                sucursal.habilitado = true; // Habilitar el input
    
                                // Agregar la sucursal a las seleccionadas 
                                if (!this.sucursalesSeleccionadas.includes(sucursal)) {
                                    this.sucursalesSeleccionadas = [
                                        ...this.sucursalesSeleccionadas,
                                        sucursal,
                                    ];
                                }
                            }
                        });
    
                        console.log('Sucursales seleccionadas:', this.sucursalesSeleccionadas);
                    },
                    error: (err) => {
                        console.error('Error al cargar las sucursales del colaborador:', err);
                    },
                    complete: () => {
                        this.finalizarCarga(); // Desactivar spinner cuando todo termine
                    },
                });
            }
        }, 100); // Verificar cada 100ms
    }
    

    validarDistancia(sucursal: any): void {
        const distancia = Number(sucursal.distancia);

        if (distancia <= 0) {
            sucursal.error = 'La distancia no puede ser cero o negativa.';
            sucursal.distancia = null; // Limpiar el valor invalido
        } else if (distancia > 50) {
            sucursal.error = 'La distancia no puede ser mayor a 50.';
            sucursal.distancia = null; // Limpiar el valor invalido
        } else {
            sucursal.error = null; // Sin errores
        }
    }

    cargarColaboradores() {
        this.iniciarCarga();
        this.colaboradorService.Listar().subscribe({
            next: (data) => {
                this.colaboradores = data;
                console.log(this.colaboradores);
            },
            complete: () => {
                this.finalizarCarga();
            },
        });
    }

    cargarAutocompletes(): void {
        this.iniciarCarga();
        let cargasCompletadas = 0;
    
        const checkFinalizarCarga = () => {
            cargasCompletadas++;
            if (cargasCompletadas === 3) {
                this.finalizarCarga();
            }
        };
    
        this.cargoService.Listar().subscribe({
            next: (response) => {
                this.cargos = response.sort((a: any, b: any) =>
                    a.carg_Descripcion.localeCompare(b.carg_Descripcion)
                );
            },
            error: (err) => console.error('Error al cargar cargos:', err),
            complete: checkFinalizarCarga,
        });
    
        this.departamentoService.Listar().subscribe({
            next: (response) => {
                this.departamentos = response.sort((a: any, b: any) =>
                    a.depa_Descripcion.localeCompare(b.depa_Descripcion)
                );
            },
            error: (err) => console.error('Error al cargar departamentos:', err),
            complete: checkFinalizarCarga,
        });
    
        this.estadoCivilservice.Listar().subscribe({
            next: (response) => {
                this.estadosCiviles = response.sort((a: any, b: any) =>
                    a.civi_Descripcion.localeCompare(b.civi_Descripcion)
                );
            },
            error: (err) => console.error('Error al cargar estados civiles:', err),
            complete: checkFinalizarCarga,
        });
    }
    

    seleccionarValoresAutocompletes(colaborador: any): void {
        this.iniciarCarga();
    
        // Reintentar seleccionar los valores hasta que esten disponibles
        const interval = setInterval(() => {
            // Asegurarse de que las listas esten cargadas
            if (this.cargos.length > 0 && this.estadosCiviles.length > 0 && this.departamentos.length > 0) {
                // Seleccionar el cargo
                const cargoo = colaborador.carg_Id;
                this.seleccionadoCargo = this.cargos.find((cargo) => cargo.carg_Id === cargoo);
    
                // Seleccionar el estado civil
                const civil = colaborador.civi_Id;
                this.seleccionadoEstadoCivil = this.estadosCiviles.find((estado) => estado.civi_Id === civil);
    
                // Seleccionar el departamento
                const departamento = colaborador.depa_Id;
                this.seleccionadoDepartamento = this.departamentos.find((dep) => dep.depa_Id === departamento);
    
                // Si todo esta seleccionado, cargar municipios
                if (this.seleccionadoCargo && this.seleccionadoEstadoCivil && this.seleccionadoDepartamento) {
                    clearInterval(interval); // Detener el reintento
    
                    const municipio = colaborador.muni_Id;
    
                    // Cargar municipios y seleccionar el correspondiente
                    this.municipioService.ListarPorDepartamento(departamento).subscribe({
                        next: (response) => {
                            this.municipios = response.sort((a: any, b: any) =>
                                a.muni_Descripcion.localeCompare(b.muni_Descripcion)
                            );
    
                            this.seleccionadoMunicipio = this.municipios.find((mun) => mun.muni_Id === municipio);
                        },
                        error: (error) => {
                            console.error('Error al cargar los municipios:', error);
                        },
                        complete: () => {
                            this.cargando = false; // Desactivar spinner cuando todo termine
                        },
                    });
                }
            }
        }, 100); // Verificar cada 100ms
    }
    

    seleccionandoSucursal(event: any): void {
        event.data.habilitado = true; // Habilitar el input al seleccionar el registro
    }

    deseleccionandoSucursal(event: any): void {
        event.data.habilitado = false; // Deshabilitar el input al deseleccionar el registro
        event.data.distancia = ''; 
    }

    seleccionandoTodasSucursales(event: any): void {
        if (event.checked) {
            // Si el checkbox esta activado, habilitar los inputs
            this.sucursales.forEach((sucursal) => {
                sucursal.habilitado = true;
            });
        } else {
            // Si el checkbox global esta desactivado, deshabilitar los inputs y opcionalmente limpiar distancia
            this.sucursales.forEach((sucursal) => {
                sucursal.habilitado = false;
                sucursal.distancia = null; 
            });
        }
    }
    validarCamposPersonales(): boolean {
        let esValido = true;

        // Recorremos los campos del tab Personal
        this.camposPersonales.forEach((campo) => {
            const control = this.colaboradorEditarForm.get(campo);
            if (control && control.invalid) {
                if (this.enviadoPersonal) {
                    control.markAsDirty(); // Marca el control como "sucio" si enviadoPersonal es true
                    control.updateValueAndValidity();
                }
                esValido = false;
            }
        });

        return esValido; // Retorna true si todos los campos son validos
    }

    //valida los campos del tab Personal
    //si es valido avanza al siguiente, de lo contrario no avanza y activa mensajes de error
    siguiente() {
        // Validar los campos del tab Personal
        const dni = this.colaboradorEditarForm.get('cola_DNI')?.value;
        const correo = this.colaboradorEditarForm.get(
            'cola_CorreoElectronico'
        )?.value;

        if (dni && correo) {
            // Validar si tanto DNI como correo existen en un registro diferente al que se esta editando
            if (
                this.colaboradores.some(
                    (c) =>
                        c.cola_DNI === dni &&
                        c.cola_CorreoElectronico === correo &&
                        c.cola_Id !== this.colaId
                )
            ) {
                this.dniYaRegistrado = true;
                this.correoYaRegistrado = true;
                this.IndexTab = 0;
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'Número de identidad y Correo electrónico existente.',
                    life: 3000,
                });
                return;
            }
        }

        // Validar si el DNI ya existe en otro registro
        if (
            dni &&
            this.colaboradores.some(
                (c) => c.cola_DNI === dni && c.cola_Id !== this.colaId
            )
        ) {
            this.dniYaRegistrado = true; // Activa la bandera para el mensaje
            this.IndexTab = 0; // Mantén el usuario en el tab actual
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Número de identidad existente.',
                life: 3000,
            });
            return;
        }

        // Validar si el correo electronico ya existe en otro registro
        if (
            correo &&
            this.colaboradores.some(
                (c) =>
                    c.cola_CorreoElectronico === correo &&
                    c.cola_Id !== this.colaId
            )
        ) {
            this.correoYaRegistrado = true; // Activa la bandera para el mensaje
            this.IndexTab = 0; // Mantén el usuario en el tab actual
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Correo electrónico existente.',
                life: 3000,
            });
            return;
        }

        if (!this.validarCamposPersonales()) {
            this.enviadoPersonal = true;
            return;
        }

        this.enviadoSucursales = false;
        this.IndexTab = 1;
    }

    anterior() {
        this.IndexTab = this.IndexTab === 0 ? 2 : this.IndexTab - 1;
    }

    filtroCargo(event: any) {
        const query = event.query.toLowerCase();
        this.filtradoCargos = this.cargos.filter((cargo) =>
            cargo.carg_Descripcion.toLowerCase().includes(query)
        );
    }
    filtroDepartamento(event: any) {
        const query = event.query.toLowerCase();
        this.filtradoDepartamentos = this.departamentos.filter((departamento) =>
            departamento.depa_Descripcion.toLowerCase().includes(query)
        );
    }
    seleccionandoDepartamento(event: any) {
        this.seleccionadoDepartamento = event?.value?.depa_Id;

        if (this.seleccionadoDepartamento) {
            this.municipioService
                .ListarPorDepartamento(this.seleccionadoDepartamento)
                .subscribe(
                    (response) => {
                        this.municipios = response.sort((a: any, b: any) =>
                            a.muni_Descripcion.localeCompare(b.muni_Descripcion)
                        );
                        this.filtradoMunicipios = [];
                        this.colaboradorEditarForm.controls['muni_Id'].setValue(
                            null
                        ); // Reiniciar municipio seleccionado
                    },
                    (error) => {
                        console.error('Error al cargar los municipios:', error);
                    }
                );
        } else {
            console.warn('No se seleccionó un departamento válido');
            this.municipios = [];
            this.filtradoMunicipios = [];
        }
    }
    filtroMunicipio(event: any) {
        const query = event.query.toLowerCase();
        this.filtradoMunicipios = this.municipios.filter((municipio) =>
            municipio.muni_Descripcion.toLowerCase().includes(query)
        );
    }
    filtroEstadoCivil(event: any) {
        const query = event.query.toLowerCase();
        this.filtradoEstadosCiviles = this.estadosCiviles.filter((estado) =>
            estado.civi_Descripcion.toLowerCase().includes(query)
        );
    }

    //LIMPIAR AUTOCOMPLETES
    limpiarCargo() {
        this.seleccionadoCargo = null;
        this.colaboradorEditarForm.controls['carg_Id'].setValue(null);
    }
    limpiarDepartamento() {
        // Resetear seleccion de departamentos y municipios
        this.seleccionadoDepartamento = null;
        this.municipios = [];
        this.filtradoMunicipios = [];
        this.seleccionadoMunicipio = null;
        this.colaboradorEditarForm.controls['muni_Id'].setValue(null);
    }
    limpiarMunicipio() {
        this.seleccionadoMunicipio = null;
        this.colaboradorEditarForm.controls['muni_Id'].setValue(null);
    }
    limpiarEstadoCivil() {
        this.seleccionadoEstadoCivil = null;
        this.colaboradorEditarForm.controls['civi_Id'].setValue(null);
    }

    //VALIDACIONES:
    ValidarTexto(event: KeyboardEvent) {
        const inputElement = event.target as HTMLInputElement;
        const key = event.key;

        // Permitir letras (incluyendo ñ y acentos), espacios y teclas especiales
        if (
            !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(key) &&
            key !== 'Backspace' &&
            key !== 'Tab' &&
            key !== 'ArrowLeft' &&
            key !== 'ArrowRight'
        ) {
            event.preventDefault();
            return;
        }

        // Evitar espacio inicial
        if (key === ' ' && inputElement.selectionStart === 0) {
            event.preventDefault();
        }
    }
    permitirSoloLetras(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        let texto = inputElement.value;

        // Limitar a solo letras, espacios y caracteres especiales válidos
        texto = texto
            .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '') // Eliminar caracteres no válidos
            .replace(/\s{2,}/g, ' ') // Evitar multiples espacios consecutivos
            .replace(/^\s/, ''); // Evitar espacio al inicio

        const controlName = inputElement.getAttribute('formControlName');
        if (controlName) {
            inputElement.value = texto;
            this.colaboradorEditarForm.controls[controlName].setValue(texto);
        }
    }

    ValidarNumeros(event: KeyboardEvent) {
        const key = event.key;

        // Permitir solo números y teclas especiales
        if (
            !/^\d$/.test(key) &&
            key !== 'Backspace' &&
            key !== 'Tab' &&
            key !== 'ArrowLeft' &&
            key !== 'ArrowRight'
        ) {
            event.preventDefault();
        }
    }
    permitirSoloNumeros(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        const texto = inputElement.value;

        // Permitir solo números
        inputElement.value = texto.replace(/[^0-9]/g, '');

        // Limitar a 13 caracteres
        if (inputElement.value.length > 13) {
            inputElement.value = inputElement.value.substring(0, 13);
        }

        const controlName = inputElement.getAttribute('formControlName');
        if (controlName) {
            this.colaboradorEditarForm.controls[controlName].setValue(
                inputElement.value
            );
        }
    }
    ValidarCorreo(event: KeyboardEvent) {
        const inputElement = event.target as HTMLInputElement;
        const key = event.key;

        if (
            !/^[a-zA-Z0-9@._-]+$/.test(key) &&
            key !== 'Backspace' &&
            key !== 'Tab' &&
            key !== 'ArrowLeft' &&
            key !== 'ArrowRight'
        ) {
            event.preventDefault();
            return;
        }

        const cursorPos = inputElement.selectionStart || 0;

        // Prevenir multiples @
        if (key === '@' && inputElement.value.includes('@')) {
            event.preventDefault();
            return;
        }

        // Prevenir multiples puntos consecutivos
        if (
            key === '.' &&
            (inputElement.value[cursorPos - 1] === '.' ||
                inputElement.value[cursorPos] === '.')
        ) {
            event.preventDefault();
            return;
        }

        // Prevenir mas de un punto en el dominio después del @
        if (key === '.' && inputElement.value.includes('@')) {
            const afterAt = inputElement.value.split('@')[1] || '';
            if (
                afterAt.includes('.') &&
                cursorPos > inputElement.value.indexOf('@')
            ) {
                event.preventDefault();
                return;
            }
        }

        // Evitar que inicie con un punto o punto inmediatamente después de @
        if (
            (key === '.' && cursorPos === 0) ||
            (key === '.' && inputElement.value[cursorPos - 1] === '@')
        ) {
            event.preventDefault();
            return;
        }
    }
    permitirFormatoCorreo(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        let texto = inputElement.value;

        // Eliminar caracteres invalidos
        texto = texto.replace(/[^a-zA-Z0-9@._-]/g, '');

        // Asegurar un solo @
        const partes = texto.split('@');
        if (partes.length > 2) {
            texto = partes[0] + '@' + partes.slice(1).join('');
        }

        // Asegurar que no existan puntos consecutivos
        texto = texto.replace(/\.{2,}/g, '.');

        // Prevenir punto inmediatamente después de @ o al inicio
        texto = texto.replace(/@\.|^\./g, '');

        // Actualizar el valor visual y el FormControl
        inputElement.value = texto;
        const controlName = inputElement.getAttribute('formControlName');
        if (controlName) {
            this.colaboradorEditarForm.controls[controlName].setValue(texto);
        }
    }

    cancelar() {
        this.enviadoPersonal = false;
        this.enviadoSucursales = false;
        this.dniYaRegistrado = false;
        this.correoYaRegistrado = false;

        this.colaboradorEditarForm.reset();

        this.sucursalesSeleccionadas = [];

        this.seleccionadoCargo = null;
        this.seleccionadoEstadoCivil = null;
        this.seleccionadoDepartamento = null;
        this.seleccionadoMunicipio = null;

        this.colaboradorService.limpiarId();
        this.router.navigate(['/general/colaborador']);
    }

    asignarSucursales(cola_Id: number) {
        const sucursalesData = this.sucursalesSeleccionadas.map((sucursal) => ({
            sucu_Id: sucursal.sucu_Id,
            DistanciaKm: sucursal.distancia,
        }));

        const colaboradorPorSucursal = {
            cola_Id,
            sucursales: sucursalesData,
        };
console.log('envio', colaboradorPorSucursal);
        this.colaboradorPorSucursalService
            .Actualizar(colaboradorPorSucursal)
            .subscribe({
                next: (sucursalResponse) => {
                    console.log(sucursalResponse);
                    if (sucursalResponse?.code === 200) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Colaborador actualizado exitosamente.',
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
        this.enviadoSucursales = true;

        if (
            !this.sucursalesSeleccionadas ||
            this.sucursalesSeleccionadas.length === 0
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar al menos una sucursal.',
                life: 3000,
            });
            return; // Detener 
        }

        // Validar que las distancias sean validas
        const invalidas = this.sucursalesSeleccionadas.filter(
            (sucursal) =>
                !sucursal.distancia ||
                sucursal.distancia <= 0 ||
                sucursal.distancia > 50
        );

        if (invalidas.length > 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Ingrese una distancia válida.',
                life: 3000,
            });
            return; // Detener 
        }
        const formData = { ...this.colaboradorEditarForm.value };
        formData.cola_Id = this.colaId
        formData.cola_UsuarioModificacion = 1;

        this.colaboradorService.Actualizar(formData).subscribe({
            next: (response) => {
                console.log(response);
                if (response?.code === 200 && response?.success) {
                    this.iniciarCarga();
                    this.asignarSucursales(this.colaId);
                } else if (
                    response?.code === 202 &&
                    (response?.data?.message === 'DNI existente.' ||
                        response?.data?.message === 'Correo existente.')
                ) {
                    if (response.data.message === 'DNI existente.') {
                        this.dniYaRegistrado = true;
                        this.IndexTab = 0;
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Advertencia',
                            detail: 'Número de identidad existente.',
                            life: 3000,
                        });
                    } else if (response.data.message === 'Correo existente.') {
                        this.correoYaRegistrado = true;
                        this.IndexTab = 0;
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Advertencia',
                            detail: 'Correo electrónico existente.',
                            life: 3000,
                        });
                    }
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
