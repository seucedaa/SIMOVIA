using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.Common.Models.ModelsAcceso
{
    public class UsuarioViewModel
    {
        public int usua_Id { get; set; }
        public string usua_Usuario { get; set; }
        public byte[] usua_Clave { get; set; }
        public bool usua_EsAdministrador { get; set; }
        public string usua_ObservacionActivar { get; set; }
        public string usua_ObservacionInactivar { get; set; }
        public string usua_CodigoReestablecer { get; set; }
        public int cola_Id { get; set; }
        public int role_Id { get; set; }
        public int? usua_UsuarioCreacion { get; set; }
        public DateTime? usua_FechaCreacion { get; set; }
        public int? usua_UsuarioModificacion { get; set; }
        public DateTime? usua_FechaModificacion { get; set; }
        public bool? usua_Estado { get; set; }
    }
}
