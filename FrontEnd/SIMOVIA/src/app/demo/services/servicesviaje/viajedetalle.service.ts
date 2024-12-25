import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { viajeDetalle } from '../../models/modelsviaje/viajedetalleviewmodel';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class viajeDetalleService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private viajedetalle = `${this.apiUrl}/api/ViajeDetalle/`;
  
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'XApiKey': `${this.apiKey}`
      })
    };
  }
  Listar(sucu_Id: number){
    return this.http.get<viajeDetalle[]>(`${this.viajedetalle}ListarPorSucursal/${sucu_Id}`,this.getHttpOptions());
  }

  Insertar(viajeDetalle: viajeDetalle): Observable<any> {
    const url = `${this.viajedetalle}Insertar`;
    return this.http.post(url, viajeDetalle, this.getHttpOptions());
  }
  Actualizar(viajeDetalle: viajeDetalle): Observable<any> {
    const url = `${this.viajedetalle}Actualizar`;
    return this.http.put(url, viajeDetalle, this.getHttpOptions());
  }
  Buscar(cola_Id: number){
    return this.http.get<viajeDetalle[]>(`${this.viajedetalle}Buscar/${cola_Id}`,this.getHttpOptions());
  }
}