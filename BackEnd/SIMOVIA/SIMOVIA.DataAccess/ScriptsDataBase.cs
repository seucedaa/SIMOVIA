using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.DataAccess
{
    public class ScriptsDataBase
    {
        #region Acceso
        #region Usuario
        public static string InicioSesionUsuario = "[Acce].[SP_Usuario_InicioSesion]";
        #endregion
        #endregion

        #region General

        #region Estado Civil
        public static string ListarEstadosCiviles = "[Gral].[SP_EstadosCiviles_Listar]";
        #endregion

        #region Departamento
        public static string ListarDepartamentos = "[Gral].[SP_Departamentos_Listar]";
        #endregion
        
        #region Municipio
        public static string ListarMunicipiosPorDepartamento = "[Gral].[SP_Municipios_ListarPorDepartamento]";
        #endregion
        
        #region Cargo
        public static string ListarCargos = "[Gral].[SP_Cargos_Listar]";
        #endregion

        #region Colaborador
        public static string ListarColaboradores = "[Gral].[SP_Colaboradores_Listar]";
        public static string InsertarColaborador = "[Gral].[SP_Colaborador_Insertar]";
        public static string BuscarColaborador = "[Gral].[SP_Colaborador_Buscar]";
        #endregion
        #endregion
    }
}