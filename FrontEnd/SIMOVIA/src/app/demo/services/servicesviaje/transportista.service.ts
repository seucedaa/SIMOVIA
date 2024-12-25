import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { transportista } from '../../models/modelsviaje/transportistaviewmodel';
@Injectable({
  providedIn: 'root'
})
export class transportistaService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private transportista = `${this.apiUrl}/api/Transportista/`;
  
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'XApiKey': `${this.apiKey}`
      })
    };
  }

  
  Listar (){
    return this.http.get<transportista[]>(`${this.transportista}Listar`,this.getHttpOptions());
  }

}