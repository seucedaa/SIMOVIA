﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace SIMOVIA.Entities.Entities
{
    public partial class tbColaboradoresPorSucursal
    {
        //LISTAR
        public string codigo { get; set; }
        public string cola_DNI { get; set; }
        public string colaborador { get; set; }

        public int cosu_Id { get; set; }
        public int? cosu_Distanciakm { get; set; }
        public int? cola_Id { get; set; }
        public int? sucu_Id { get; set; }

        //JSON
        public string sucursalesJSON { get; set; }


        public virtual tbColaboradores cola { get; set; }
        public virtual tbSucursales sucu { get; set; }
    }
}