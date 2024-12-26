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
  credencialesIncorrectas: string = '';
  constructor(
    private usuarioService: usuarioService,
    private router: Router,
    private messageService: MessageService,
    private cookieService: CookieService
  ) {}


  login(){

    if (!this.usuario || !this.clave) {
      this.credencialesIncorrectas = 'Usuario y contraseña son obligatorios.';
      return;
    }

    this.usuarioService.InicioSesion(this.usuario, this.clave).subscribe({
      next: (response) => {


        sessionStorage.setItem('userData', JSON.stringify(response.data));

        this.credencialesIncorrectas = '';
        this.router.navigate(['SIMOVIA']);

      },
      error: (error) => {
        
        console.error('Error al iniciar sesión:', error);
        this.credencialesIncorrectas = error.message || 'Error al conectar con el servidor.';
      }
    });
  }
}