import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { cargo } from '../../models/modelsgeneral/cargoviewmodel';
@Injectable({
  providedIn: 'root'
})
export class cargoService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private cargo = `${this.apiUrl}/api/Cargo/`;
  
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'XApiKey': `${this.apiKey}`
      })
    };
  }

  
  Listar (){
    return this.http.get<cargo[]>(`${this.cargo}Listar`,this.getHttpOptions());
  }

}