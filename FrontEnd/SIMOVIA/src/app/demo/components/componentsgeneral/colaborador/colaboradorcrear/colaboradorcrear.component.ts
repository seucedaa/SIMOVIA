import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService, TreeNode } from 'primeng/api';
import { Table } from 'primeng/table';
import { colaborador } from 'src/app/demo/models/modelsgeneral/colaboradorviewmodel';
import { colaboradorPorSucursal } from 'src/app/demo/models/modelsviaje/colaboradorporsucursalviewmodel';
import { sucursal } from 'src/app/demo/models/modelsviaje/sucursalviewmodel';
import { cargoService } from 'src/app/demo/services/servicesgeneral/cargo.service';
import { colaboradorService } from 'src/app/demo/services/servicesgeneral/colaborador.service';
import { departamentoService } from 'src/app/demo/services/servicesgeneral/departamento.service';
import { estadoCivilService } from 'src/app/demo/services/servicesgeneral/estadocivil.service';
import { municipioService } from 'src/app/demo/services/servicesgeneral/municipio.service';
import { colaboradorPorSucursalService } from 'src/app/demo/services/servicesviaje/colaboradorporsucursal.service';
import { sucursalService } from 'src/app/demo/services/servicesviaje/sucursal.service';
@Component({
    selector: 'acceso-colaborador-colaboradorcrear',
    templateUrl: './colaboradorcrear.component.html',
    styleUrl: './colaboradorcrear.component.scss',
    providers: [MessageService],
})
export class ColaboradorCrearComponent implements OnInit {
    colaboradorCrearForm: FormGroup; 

    routeItems: MenuItem[] = [];
    IndexTab: number = 0;

    //VALIDAR TAB
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

    colaboradores: colaborador[] = [];
    sucursales: sucursal[] = [];
    sucursalesSeleccionadas: sucursal[] = [];
    cargando: boolean = false;

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
        private router: Router,
    ) {
        this.colaboradorCrearForm = this.fb.group({
            cola_DNI: [null, Validators.required],
            cola_Nombres: [null, [Validators.required, Validators.pattern('^[a-zA-ZñÑ\\s]+$')]], 
            cola_Apellidos: [null, [Validators.required, Validators.pattern('^[a-zA-ZñÑ\\s]+$')]], 
            cola_CorreoElectronico: [null,
                [Validators.required,
                    Validators.pattern( /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov)$/i),
                ]],
            cola_Telefono: [null, [Validators.required]],
            cola_Sexo: ['F', [Validators.pattern('^[MF]$')]],
            cola_FechaNacimiento: [null, [Validators.required]], 
            muni_Id: [null, [Validators.required]],
            civi_Id: [null, [Validators.required]],
            carg_Id: [null, [Validators.required]],
            cola_UsuarioCreacion: [null]
        });
    }

    ngOnInit(): void {
        this.cargando = true;

        this.cargarSucursales();
        this.cargarColaboradores();
        //AUTOCOMPLETES
        this.cargoService.Listar().subscribe((response) => {
            this.cargos = response.sort((a: any, b: any) =>
                a.carg_Descripcion.localeCompare(b.carg_Descripcion)
            ); // ordenar por la descripcion
        });
        this.departamentoService.Listar().subscribe((response) => {
            this.departamentos = response.sort((a: any, b: any) =>
                a.depa_Descripcion.localeCompare(b.depa_Descripcion)
            ); 
        });
        this.estadoCivilservice.Listar().subscribe((response) => {
            this.estadosCiviles = response.sort((a: any, b: any) =>
                a.civi_Descripcion.localeCompare(b.civi_Descripcion)
            ); 
        });

        //RANGO PARA FECHA DE NACIMIENTO
        const anioActual = new Date().getFullYear();
        const fechaActual = new Date(); // Fecha actual

        // Establecer fecha mínima y máxima
        this.fechaMinima = new Date(anioActual - 80, 0, 1); 
        this.fechaMaxima = new Date(anioActual, fechaActual.getMonth(), fechaActual.getDate()); 

        // Rango de años para el selector de años
        this.anioRango = `${anioActual - 80}:${anioActual - 80}`;
    }

    cargarSucursales() {
        this.sucursalService.Listar().subscribe({
            next: (data) => {
                this.sucursales = data;
                console.log(this.sucursales);
            }
        });
    }

    validarDistancia(sucursal: any): void {
        const distancia = Number(sucursal.distancia);

        if (distancia <= 0) {
            sucursal.error = 'La distancia no puede ser cero o negativa.';
            sucursal.distancia = null; // Limpiar el valor invlido
        } else if (distancia > 50) {
            sucursal.error = 'La distancia no puede ser mayor a 50.';
            sucursal.distancia = null; // Limpiar el valor invaido
        } else {
            sucursal.error = null; 
        }
    }

    cargarColaboradores() {
        this.colaboradorService.Listar().subscribe({
            next: (data) => {
                this.colaboradores = data;
                console.log(this.colaboradores);
            }
        });
    }

    seleccionandoSucursal(event: any): void {
      event.data.habilitado = true; // Habilitar el input al seleccionar el registro
    }

    deseleccionandoSucursal(event: any): void {
      event.data.habilitado = false; // Deshabilitar el input al deseleccionar el registro
      event.data.distancia = ''; // Limpiar el campo distancia
    }

    seleccionandoTodasSucursales(event: any): void {
        if (event.checked) {
          // Si el checkbox global esta activado, habilitar los inputs
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

        // Recorrer los campos del tab Personal
        this.camposPersonales.forEach((campo) => {
            const control = this.colaboradorCrearForm.get(campo);
            if (control && control.invalid) {
                if (this.enviadoPersonal) {
                    control.markAsDirty(); 
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
        const dni = this.colaboradorCrearForm.get('cola_DNI')?.value;
        const correo = this.colaboradorCrearForm.get('cola_CorreoElectronico')?.value;

        if (dni && this.colaboradores.some(c => c.cola_DNI === dni) && correo && this.colaboradores.some(c => c.cola_CorreoElectronico === correo)) {
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

        if (dni && this.colaboradores.some(c => c.cola_DNI === dni)) {
            this.dniYaRegistrado = true; // Activa la bandera para el mensaje
            this.IndexTab = 0; // Mantener al usuario en el tab actual
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Número de identidad existente.',
                life: 3000,
            });
            return;
        }

        if (correo && this.colaboradores.some(c => c.cola_CorreoElectronico === correo)) {
            this.correoYaRegistrado = true; // Activa la bandera para el mensaje
            this.IndexTab = 0; // Mantener al usuario en el tab actual
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

    //FILTROS AUTOCOMPLETES
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
            this.municipioService.ListarPorDepartamento(this.seleccionadoDepartamento)
                .subscribe(
                    (response) => {
                        this.municipios = response.sort((a: any, b: any) =>
                        a.muni_Descripcion.localeCompare(b.muni_Descripcion));
                        this.filtradoMunicipios = [];
                        this.colaboradorCrearForm.controls['muni_Id'].setValue(null); // Reiniciar municipio seleccionado
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
        this.colaboradorCrearForm.controls['carg_Id'].setValue(null);
    }
    limpiarDepartamento() {
        // Resetear selección de departamentos y municipios
        this.seleccionadoDepartamento = null;
        this.municipios = [];
        this.filtradoMunicipios = [];
        this.seleccionadoMunicipio = null;
        this.colaboradorCrearForm.controls['muni_Id'].setValue(null);
    }
    limpiarMunicipio() {
        this.seleccionadoMunicipio = null;
        this.colaboradorCrearForm.controls['muni_Id'].setValue(null);
    }
    limpiarEstadoCivil() {
        this.seleccionadoEstadoCivil = null;
        this.colaboradorCrearForm.controls['civi_Id'].setValue(null);
    }

    //VALIDACIONES:
    ValidarTexto(event: KeyboardEvent) {
        const inputElement = event.target as HTMLInputElement;
        const key = event.key;

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

        texto = texto
            .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
            .replace(/\s{2,}/g, ' ') // Evitar mutiples espacios consecutivos
            .replace(/^\s/, ''); // Evitar espacio al inicio

        const controlName = inputElement.getAttribute('formControlName');
        if (controlName) {
            inputElement.value = texto;
            this.colaboradorCrearForm.controls[controlName].setValue(texto);
        }
    }

    ValidarNumeros(event: KeyboardEvent) {
        const key = event.key;

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

        // Actualizar el FormControl correspondiente
        const controlName = inputElement.getAttribute('formControlName');
        if (controlName) {
            this.colaboradorCrearForm.controls[controlName].setValue(inputElement.value);
        }
    }
    ValidarCorreo(event: KeyboardEvent) {
        const inputElement = event.target as HTMLInputElement;
        const key = event.key;

        // Permitir letras, números, @, ., -, _, y teclas especiales como backspace y flechas
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

        // Evitar que inicie con un punto o punto inmediatamente despues de @
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
            this.colaboradorCrearForm.controls[controlName].setValue(texto);
        }
    }
  
    cancelar() {
        this.enviadoPersonal = false;
        this.enviadoSucursales = false;
        this.dniYaRegistrado = false;
        this.correoYaRegistrado = false;

        this.colaboradorCrearForm.reset();

        this.sucursalesSeleccionadas = [];

        this.seleccionadoCargo = null;
        this.seleccionadoEstadoCivil = null;
        this.seleccionadoDepartamento = null;
        this.seleccionadoMunicipio = null;
    
        this.colaboradorService.limpiarId();
        this.router.navigate(['/general/colaborador']);
    }

    asignarSucursales(cola_Id: number){
        const sucursalesData = this.sucursalesSeleccionadas.map((sucursal) => ({
          sucu_Id: sucursal.sucu_Id,
          DistanciaKm: sucursal.distancia,
        }));

        const colaboradorPorSucursal = {
          cola_Id,
          sucursales: sucursalesData,
        };

        this.colaboradorPorSucursalService.Insertar(colaboradorPorSucursal).subscribe({
            next: (sucursalResponse) => {
              if (sucursalResponse?.code === 200) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Colaborador creado exitosamente.',
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
        this.enviadoSucursales = true;

        if (!this.sucursalesSeleccionadas || this.sucursalesSeleccionadas.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar una sucursal.',
                life: 3000,
            });
            return; // Detener 
        }

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

        const formData = { ...this.colaboradorCrearForm.value };
        formData.cola_UsuarioCreacion = 1;

        this.colaboradorService.Insertar(formData).subscribe({
            next: (response) => {
                if (response?.code === 200 && response?.success) {
                    const colaId = response.data.codeStatus; 

                    this.asignarSucursales(colaId);
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
                    } else if (
                        response.data.message === 'Correo existente.'
                    ) {
                        this.correoYaRegistrado = true;
                        this.IndexTab = 0;
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Advertencia',
                            detail: 'Correo electrónico existente.',
                            life: 3000,
                        });
                    }
                }else {
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
