import { Component } from '@angular/core';
import { usuarioService } from '../../../services/servicesacceso/usuario.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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
  ) {}

  login() {
    this.enviado = true;
    this.credencialesIncorrectas = false;

    if (!this.usuario || !this.clave) {
      return;
    }

    this.usuarioService.InicioSesion(this.usuario, this.clave).subscribe({
      next: (response) => {
        if (response.success) {
          sessionStorage.setItem('userData', JSON.stringify(response.data));
          sessionStorage.setItem('colaborador', JSON.stringify(response.data.colaborador[0]));
          sessionStorage.setItem('usuario', JSON.stringify(response.data.usuario));
          console.log(response.data);
          console.log(response.data.colaborador[0]);
          console.log(response.data.usuario);
          this.router.navigate(['SIMOVIA']);
        } else {
          this.credencialesIncorrectas = true;
        }
      },
      error: (error) => {
        const errorMessage = error?.message || 'Error desconocido';
        console.log('errormesag', errorMessage);
      
        if (errorMessage.includes('Usuario o contraseña incorrectos')) {
          this.credencialesIncorrectas = true;
        } else if (errorMessage.includes('Http failure response') || errorMessage.includes('0 Unknown Error')) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error de Conexión',
            detail: 'No se pudo conectar con el servidor.',
            life: 3000,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error del Servidor',
            detail: 'Se produjo un error inesperado.',
            life: 3000,
          });
        }
      }
            
      
    });
  }
}
