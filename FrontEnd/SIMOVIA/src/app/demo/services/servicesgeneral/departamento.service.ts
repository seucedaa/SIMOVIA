import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { departamento } from '../../models/modelsgeneral/departamentoviewmodel';
@Injectable({
  providedIn: 'root'
})
export class departamentoService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private departamento = `${this.apiUrl}/api/Departamento/`;
  
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'XApiKey': `${this.apiKey}`
      })
    };
  }

  
  Listar (){
    return this.http.get<departamento[]>(`${this.departamento}Listar`,this.getHttpOptions());
  }

}