export class colaboradorPorSucursal {
    cola_Id?:number;
    sucursales?: {
        sucu_Id: number;
        DistanciaKm: number;
      }[];

  
}

export class colaboradoresPorSucursal{
  codigo?:string;
  cola_Id?:number;
  cola_DNI?:string;
  colaborador?:string;
  cosu_Distanciakm:number;
  sucu_Id:number;
}