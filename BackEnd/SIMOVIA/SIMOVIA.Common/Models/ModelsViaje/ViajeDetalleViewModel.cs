using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.Common.Models.ModelsViaje
{
    public class ViajeDetalleViewModel
    {
        public int vide_Id { get; set; }
        public int vien_Id { get; set; }
        public int? cola_Id { get; set; }
        public List<int> colaboradores { get; set; } 

        public string colaboradoresJSON { get; set; }
    }
}

