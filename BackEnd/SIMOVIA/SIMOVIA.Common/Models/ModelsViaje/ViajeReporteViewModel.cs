using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.Common.Models.ModelsViaje
{
    public class ViajeReporteViewModel
    {
        public IEnumerable<ViajeDetalleViewModel> Detalle { get; set; }
        public string TotalPagar { get; set; }                         
    }

}
