using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.Common.Models.ModelsViaje
{
    public class ViajeEncabezadoViewModel
    {
        public int vien_Id { get; set; }
        public DateTime vien_Fecha { get; set; }
        public int vien_DistanciaTotalkm { get; set; }
        public decimal vien_TarifaTransportista { get; set; }
        public decimal vien_Total { get; set; }
        public int sucu_Id { get; set; }
        public int tran_Id { get; set; }
        public int vien_UsuarioCreacion { get; set; }
        public DateTime vien_FechaCreacion { get; set; }
        public int? vien_UsuarioModificacion { get; set; }
        public DateTime? vien_FechaModificacion { get; set; }
        public bool? vien_Estado { get; set; }
    }
}
