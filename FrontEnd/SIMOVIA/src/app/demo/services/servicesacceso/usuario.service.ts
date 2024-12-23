import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { usuario } from '../../models/modelsacceso/usuarioviewmodel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class usuarioService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private usuario = `${this.apiUrl}/api/Usuario/`;

  private pantallasPermitidas: { pant_Descripcion: string }[] = []; // Manejo de pantallas


  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'XApiKey': `${this.apiKey}`,
      }),
    };
  }

  // Método para iniciar sesión
  InicioSesion(usuario: string, clave: string): Observable<usuario[]> {
    const url = `${this.usuario}InicioSesion/${usuario}/${clave}`;
    return this.http.get<usuario[]>(url, this.getHttpOptions());
  }

  getPantallasPermitidas(): string[] {
    return this.pantallasPermitidas.map(p => p.pant_Descripcion.toLowerCase().trim());
  }
}
