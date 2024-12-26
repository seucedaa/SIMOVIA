import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Reporte } from '../../models/modelsviaje/reporteviajeviewmodel';

@Injectable({
  providedIn: 'root'
})
export class reporteService {
  private apiUrl: string = environment.apiUrl;
  private apiKey: string = environment.apiKey;
  private viaje = `${this.apiUrl}/api/ViajeEncabezado/`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'XApiKey': `${this.apiKey}`
      })
    };
  }

  Reporte(tran_Id: number, fechaInicio: string, fechaFin: string): Observable<Reporte[]> {
    const url = `${this.viaje}Reporte/${tran_Id}/${fechaInicio}/${fechaFin}`;
    return this.http.get<Reporte[]>(url, this.getHttpOptions());
  }
}
