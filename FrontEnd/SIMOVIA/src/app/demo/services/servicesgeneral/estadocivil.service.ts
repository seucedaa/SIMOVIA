import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { estadoCivil } from '../../models/modelsgeneral/estadocivilviewmodel';
@Injectable({
  providedIn: 'root'
})
export class estadoCivilService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private estadocivil = `${this.apiUrl}/api/EstadoCivil/`;
  
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'XApiKey': `${this.apiKey}`
      })
    };
  }

  
  Listar (){
    return this.http.get<estadoCivil[]>(`${this.estadocivil}Listar`,this.getHttpOptions());
  }

}