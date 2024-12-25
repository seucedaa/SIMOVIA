import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { sucursal } from '../../models/modelsviaje/sucursalviewmodel';
@Injectable({
  providedIn: 'root'
})
export class sucursalService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private sucursal = `${this.apiUrl}/api/Sucursal/`;
  
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'XApiKey': `${this.apiKey}`
      })
    };
  }

  
  Listar (){
    return this.http.get<sucursal[]>(`${this.sucursal}Listar`,this.getHttpOptions());
  }

}