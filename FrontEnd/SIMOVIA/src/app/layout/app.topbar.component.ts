import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [ConfirmationService, MessageService]
})
export class AppTopBarComponent implements OnInit{

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private cookieService: CookieService,
        private router: Router
    ) { }

    usuario:string = '';
    colaborador: string = '';
    cargo:string = '';
    correo:string = '';
    telefono:string = '';

    ngOnInit(): void {
      const usuarioRegistrado = sessionStorage.getItem('usuario');
      const usuarioParseado = JSON.parse(usuarioRegistrado);

      const colaboradorRegistrado = sessionStorage.getItem('colaborador');
      const colaboradorParseado = JSON.parse(colaboradorRegistrado);

      this.usuario = usuarioParseado.usua_Usuario;
      this.colaborador = colaboradorParseado.colaborador;
      this.cargo = colaboradorParseado.carg_Descripcion;
      this.correo = colaboradorParseado.cola_CorreoElectronico;
      this.telefono = `${colaboradorParseado.cola_Telefono.substring(0, 4)}-${colaboradorParseado.cola_Telefono.substring(4)}`;

    }

    salir(event: Event) {
        this.confirmationService.confirm({
          key: 'salir',
          target: event.target || new EventTarget(),
          message: '¿Esta seguro que desea cerrar la sesión?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            sessionStorage.clear();
            
            this.cookieService.delete('roleID');
            this.cookieService.delete('esAdmin');
    
            this.messageService.add({ severity: 'info', summary: 'Listo', detail: 'Sesión cerrada con éxito' });
    
            this.router.navigate(['/auth/login']);
          },
          reject: () => {
          }
        });
      }
}