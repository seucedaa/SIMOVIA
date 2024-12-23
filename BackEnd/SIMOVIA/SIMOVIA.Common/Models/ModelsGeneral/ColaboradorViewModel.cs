using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.Common.Models.ModelsGeneral
{
    public class ColaboradorViewModel
    {
        public int cola_Id { get; set; }
        public string cola_DNI { get; set; }
        public string cola_Nombres { get; set; }
        public string cola_Apellidos { get; set; }
        public string cola_CorreoElectronico { get; set; }
        public string cola_Telefono { get; set; }
        public string cola_Sexo { get; set; }
        public DateTime cola_FechaNacimiento { get; set; }
        public string cola_ObservacionActivar { get; set; }
        public string cola_ObservacionInactivar { get; set; }
        public int muni_Id { get; set; }
        public int civi_Id { get; set; }
        public int carg_Id { get; set; }
        public int cola_UsuarioCreacion { get; set; }
        public DateTime? cola_FechaCreacion { get; set; }
        public int? cola_UsuarioModificacion { get; set; }
        public DateTime? cola_FechaModificacion { get; set; }
        public bool? cola_Estado { get; set; }
    }
}
