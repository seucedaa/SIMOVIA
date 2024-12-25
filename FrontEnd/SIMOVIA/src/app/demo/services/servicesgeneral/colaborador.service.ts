import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { colaborador } from '../../models/modelsgeneral/colaboradorviewmodel';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class colaboradorService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private colaborador = `${this.apiUrl}/api/Colaborador/`;
  
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'XApiKey': `${this.apiKey}`
      })
    };
  }

  //Navegar entre componentes con el ID, sin mostrarlo en la URL
  private colaId: number | null = null;

  almacenarId(id: number) {
    this.colaId = id;
    localStorage.setItem('colaId', id.toString()); 
  }

  obtenerId(): number | null {
    if (this.colaId) {
        return this.colaId;
    }
    const guardarId = localStorage.getItem('colaId');
    return guardarId ? Number(guardarId) : null;
  }

  limpiarId() {
    this.colaId = null;
    localStorage.removeItem('colaId');
  }
  
  //Peticiones a la API
  Listar (){
    return this.http.get<colaborador[]>(`${this.colaborador}Listar`,this.getHttpOptions());
  }

  Eliminar(colaId: number): Observable<any> {
    const url = `${this.colaborador}Eliminar?id=${colaId}`;
    return this.http.delete(url, this.getHttpOptions());
  }

  Insertar(optante: colaborador): Observable<any> {
    const url = `${this.colaborador}Insertar`;
    return this.http.post(url, optante, this.getHttpOptions());
}

  Buscar(cola_Id: number){
    return this.http.get<colaborador[]>(`${this.colaborador}Buscar/${cola_Id}`,this.getHttpOptions());
  }

  Actualizar(colaborador: colaborador): Observable<any> {
    const url = `${this.colaborador}Actualizar`;
    return this.http.put(url, colaborador, this.getHttpOptions());
  }
}