using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.Common.Models.ModelsViaje
{
    public class ColaboradorPorSucursalViewModel
    {
        public int cosu_Id { get; set; }
        public int? cosu_Distanciakm { get; set; }
        public int? cola_Id { get; set; }
        public int? sucu_Id { get; set; }

        public List<SucursalViewModel> sucursales { get; set; }

        public string sucursalesJSON { get; set; }
    }

    public class SucursalViewModel
    {
        public int sucu_Id { get; set; }
        public int DistanciaKm { get; set; }
    }
}

