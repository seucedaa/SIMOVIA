import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, TreeNode } from 'primeng/api';
import { cargoService } from 'src/app/demo/services/servicesgeneral/cargo.service';
import { colaboradorService } from 'src/app/demo/services/servicesgeneral/colaborador.service';
import { departamentoService } from 'src/app/demo/services/servicesgeneral/departamento.service';
import { estadoCivilService } from 'src/app/demo/services/servicesgeneral/estadocivil.service';
import { municipioService } from 'src/app/demo/services/servicesgeneral/municipio.service';

@Component({
    selector: 'acceso-colaborador-colaboradoreditar',
    templateUrl: './colaboradoreditar.component.html',
    providers: [MessageService],
})
export class ColaboradorEditarComponent implements OnInit {
    colaboradorEditarForm: FormGroup; 
    enviado: boolean = false;
    colaboradorYaRegistrado: boolean = false;

    colaId: number | null | undefined;
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
    fechaPorDefecto!: Date;
    anioRango!: string;

    dniYaRegistrado: boolean = false;
    correoYaRegistrado: boolean = false;
    constructor(
        private colaboradorService: colaboradorService,
        private estadoCivilservice: estadoCivilService,
        private departamentoService: departamentoService,
        private municipioService: municipioService,
        private cargoService: cargoService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private router: Router,
    ) {
        this.colaboradorEditarForm = this.fb.group({
            cola_DNI: [null, [Validators.required, Validators.pattern('^[0-9]{13}$')]],
            cola_Imagen: [null, [Validators.required]],
            cola_Nombres: [null, [Validators.required, Validators.pattern('^[a-zA-ZñÑ\\s]+$')]], 
            cola_Apellidos: [null, [Validators.required, Validators.pattern('^[a-zA-ZñÑ\\s]+$')]], 
            cola_CorreoElectronico: [null, [Validators.required, Validators.email]],
            cola_Telefono: [null, [Validators.required, Validators.pattern('^[0-9]{8}$')]],
            cola_Sexo: [null, [Validators.required, Validators.pattern('^[MF]$')]],
            cola_FechaNacimiento: [null, [Validators.required]], 
            muni_Id: [null, [Validators.required]],
            civi_Id: [null, [Validators.required]],
            carg_Id: [null, [Validators.required]],
            cola_UsuarioModificacion: [null]
        });
        
    }

    ngOnInit(): void {
        this.cargando = true;

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
        const currentYear = new Date().getFullYear();
        const today = new Date();

        // Establecer fecha mínima y máxima
        this.fechaMinima = new Date(currentYear - 30, 0, 1); // 30 años atrás (1 de enero)
        this.fechaMaxima = new Date(currentYear - 18, 11, 31); // 18 años atrás (31 de diciembre)

        // Fecha por defecto para mostrar al abrir el calendario
        this.fechaPorDefecto = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
        ); // 18 años atrás mismo mes y día

        // Rango de años para el selector de años
        this.anioRango = `${currentYear - 30}:${currentYear - 30}`;
    
        this.colaId = this.colaboradorService.obtenerId();
    
        if (this.colaId) {
            this.colaboradorService.Buscar(this.colaId).subscribe({
                next: (colaborador: any) => {
                    this.colaboradorEditarForm.patchValue({
                        cola_DNI: colaborador.cola_DNI,
                        cola_Imagen: colaborador.cola_Imagen,
                        cola_Nombres: colaborador.cola_Nombres,
                        cola_Apellidos: colaborador.cola_Apellidos,
                        cola_CorreoElectronico: colaborador.cola_CorreoElectronico,
                        cola_Telefono: colaborador.cola_Telefono,
                        cola_Sexo: colaborador.cola_Sexo,
                        cola_FechaNacimiento: colaborador.cola_FechaNacimiento,
                        muni_Id: colaborador.muni_Id,
                        civi_Id: colaborador.civi_Id,
                        carg_Id: colaborador.carg_Id,
                    });
                    
                }
            });
        } 
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
            this.municipioService.ListarPorDepartamento(this.seleccionadoDepartamento)
                .subscribe(
                    (response) => {
                        this.municipios = response.sort((a: any, b: any) =>
                        a.muni_Descripcion.localeCompare(b.muni_Descripcion));
                        this.filtradoMunicipios = [];
                        this.colaboradorEditarForm.controls['muni_Id'].setValue(null); // Reiniciar municipio seleccionado
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
        // Resetear selección de departamentos y municipios
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
            .replace(/\s{2,}/g, ' ') // Evitar múltiples espacios consecutivos
            .replace(/^\s/, ''); // Evitar espacio al inicio

        // Obtener el nombre del control basado en el atributo formControlName
        const controlName = inputElement.getAttribute('formControlName');
        if (controlName) {
            inputElement.value = texto;
            this.colaboradorEditarForm.controls[controlName].setValue(texto);
        }
    }

    ValidarNumeros(event: KeyboardEvent) {
        const key = event.key;

        // Permitir solo números y teclas especiales como backspace, tab, flechas
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
            this.colaboradorEditarForm.controls[controlName].setValue(inputElement.value);
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

        // Prevenir múltiples @
        if (key === '@' && inputElement.value.includes('@')) {
            event.preventDefault();
            return;
        }

        // Prevenir múltiples puntos consecutivos
        if (
            key === '.' &&
            (inputElement.value[cursorPos - 1] === '.' ||
                inputElement.value[cursorPos] === '.')
        ) {
            event.preventDefault();
            return;
        }

        // Prevenir más de un punto en el dominio después del @
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

        // Eliminar caracteres inválidos
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
        this.enviado = false;
        this.dniYaRegistrado = false;
        this.correoYaRegistrado = false;
        // Limpiar el formulario
        this.colaboradorEditarForm.reset();

        // Limpia los valores de los autocompletes
        this.seleccionadoCargo = null;
        this.seleccionadoEstadoCivil = null;
        this.seleccionadoDepartamento = null;
        this.seleccionadoMunicipio = null;
    
        this.colaboradorService.limpiarId();
        this.router.navigate(['/general/colaborador']);
    }
    

    actualizar() {
        this.enviado = true;

        const formData = { ...this.colaboradorEditarForm.value };
        if(formData.cola_DescripcionColaborador == null)
            return;

        formData.cola_Id = this.colaId;
        formData.cola_UsuarioModificacion = 1;
        console.log(formData);

        this.colaboradorService.Actualizar(formData).subscribe({
            next: (response) => {
                if (response?.code === 200 && response?.success) {

                } else if (
                    response?.code === 500 &&
                    response?.message === 'Colaborador ya registrado.'
                ) {
                    this.colaboradorYaRegistrado = true;
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: 'El rol ya está registrado.',
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
}
