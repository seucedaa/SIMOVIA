import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { viaje } from '../../models/modelsviaje/viajeencabezadoviewmodel';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class viajeService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private viaje = `${this.apiUrl}/api/ViajeEncabezado/`;
  
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'XApiKey': `${this.apiKey}`
      })
    };
  }

  private vienId: number | null = null;

  almacenarId(id: number) {
    this.vienId = id;
    localStorage.setItem('vienId', id.toString()); 
  }

  obtenerId(): number | null {
    if (this.vienId) {
        return this.vienId;
    }
    const guardarId = localStorage.getItem('vienId');
    return guardarId ? Number(guardarId) : null;
  }

  limpiarId() {
    this.vienId = null;
    localStorage.removeItem('vienId');
  }
  
  //Peticiones a la API
  Listar (){
    return this.http.get<viaje[]>(`${this.viaje}Listar`,this.getHttpOptions());
  }

  Eliminar(vienId: number): Observable<any> {
    const url = `${this.viaje}Eliminar?id=${vienId}`;
    return this.http.delete(url, this.getHttpOptions());
  }

  Insertar(optante: viaje): Observable<any> {
    const url = `${this.viaje}Insertar`;
    return this.http.post(url, optante, this.getHttpOptions());
}

  Buscar(vien_Id: number){
    return this.http.get<viaje[]>(`${this.viaje}Buscar/${vien_Id}`,this.getHttpOptions());
  }

  Actualizar(viaje: viaje): Observable<any> {
    const url = `${this.viaje}Actualizar`;
    return this.http.put(url, viaje, this.getHttpOptions());
  }
}