import { Component } from '@angular/core';
import { usuario } from '../../../models/modelsacceso/usuarioviewmodel';
import { usuarioService } from '../../../services/servicesacceso/usuario.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {
  public usuario: string = '';
  public clave: string = '';
  enviado: boolean = false;
  credencialesIncorrectas: boolean = false;
  constructor(
    private usuarioService: usuarioService,
    private router: Router,
    private messageService: MessageService,
    private cookieService: CookieService
  ) {}

  login() {
    this.enviado = true;

    if (this.clave?.trim() && this.usuario?.trim()) {
      this.usuarioService.InicioSesion(this.usuario, this.clave).subscribe({
        next: (data) => {
          if (data.length > 0) {
            const usuarioData = data[0];
            this.cookieService.set('usua_Id', usuarioData.usua_Id!.toString());
            this.cookieService.set('usua_Usuario', usuarioData.usua_Usuario!);
            this.cookieService.set('usua_EsAdministrador', usuarioData.usua_EsAdministrador!.toString());
            this.cookieService.set('cola_Id', usuarioData.cola_Id!.toString());
            this.cookieService.set('role_Id', usuarioData.role_Id!.toString());

            this.router.navigate(['']);
          } else {
            this.credencialesIncorrectas = true;
          }
        },
        error: (error) => {
          // Mostrar error del servidor
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error de conexión o del servidor',
            life: 3000,
          });
          console.error('Error en el login:', error);
        },
      });
    }
  }
}
