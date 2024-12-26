import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { usuario } from '../../models/modelsacceso/usuarioviewmodel';
import { catchError, map, Observable, pipe, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class usuarioService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private usuario = `${this.apiUrl}/api/Usuario/`;


  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'XApiKey': `${this.apiKey}`,
      }),
    };
  }

  // Método para iniciar sesión
  InicioSesion(usuario: string, clave: string): Observable<any> {
    const url = `${this.usuario}InicioSesion/${usuario}/${clave}`;
    return this.http.get(url, this.getHttpOptions()).pipe(
      map((response: any) => {
        if (response.statusCode === 200 && response.success) {
          return response; // Retorna la respuesta en caso de éxito
        } else {
          throw new Error(response.message || 'Error al iniciar sesión.');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMsg = 'Error desconocido';
  
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMsg = `Error del cliente: ${error.error.message}`;
        } else {
          // Otros errores del servidor
          errorMsg = `Error del servidor: ${error.status} - ${error.error?.message || error.message}`;
        }
  
        console.error('Error al procesar la solicitud:', error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

}
