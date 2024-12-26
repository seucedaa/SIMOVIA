using System;
using System.Collections.Generic;

namespace SIMOVIA.Common.Models.ModelsViaje
{
    public class ViajeDetalleViewModel
    {
        public int vien_Id { get; set; }
        public DateTime vien_Fecha { get; set; }
        public string vien_DistanciaTotalkm { get; set; }
        public string vien_TarifaTransportista { get; set; }
        public string vien_Total { get; set; }
        public string sucursal { get; set; }
        public string transportista { get; set; }
        public string colaborador { get; set; }
        public string? cosu_Distanciakm { get; set; }
        public string usuarioCreacion { get; set; }
        public DateTime vien_FechaCreacion { get; set; }

        public int vide_Id { get; set; }
        public int? cola_Id { get; set; }
        public List<int> colaboradores { get; set; }

        public string colaboradoresJSON { get; set; }
    }
}
