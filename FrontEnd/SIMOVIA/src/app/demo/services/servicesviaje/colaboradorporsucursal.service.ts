import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { colaboradorPorSucursal } from '../../models/modelsviaje/colaboradorporsucursalviewmodel';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class colaboradorPorSucursalService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private colaboradorporsucursal = `${this.apiUrl}/api/ColaboradorPorSucursal/`;
  
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'XApiKey': `${this.apiKey}`
      })
    };
  }
  Listar(sucu_Id: number){
    return this.http.get<colaboradorPorSucursal[]>(`${this.colaboradorporsucursal}ListarPorSucursal/${sucu_Id}`,this.getHttpOptions());
  }

  Insertar(colaboradorPorSucursal: colaboradorPorSucursal): Observable<any> {
    const url = `${this.colaboradorporsucursal}Insertar`;
    return this.http.post(url, colaboradorPorSucursal, this.getHttpOptions());
  }
  Actualizar(colaboradorPorSucursal: colaboradorPorSucursal): Observable<any> {
    const url = `${this.colaboradorporsucursal}Actualizar`;
    return this.http.put(url, colaboradorPorSucursal, this.getHttpOptions());
  }
  Buscar(cola_Id: number){
    return this.http.get<colaboradorPorSucursal[]>(`${this.colaboradorporsucursal}Buscar/${cola_Id}`,this.getHttpOptions());
  }
}