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
        public static string ActualizarColaborador = "[Gral].[SP_Colaborador_Actualizar]";
        public static string BuscarColaborador = "[Gral].[SP_Colaborador_Buscar]";
        public static string EliminarColaborador = "[Gral].[SP_Colaborador_Eliminar]";
        #endregion
        #endregion

        #region Viaje

        #region Encabezado
        public static string InsertarViajeEncabezado = "[Viaj].[SP_ViajeEncabezado_Insertar]";
        public static string ActualizarViajeEncabezado = "[Viaj].[SP_ViajeEncabezado_Actualizar]";
        public static string BuscarViajeEncabezado = "[Viaj].[SP_ViajeEncabezado_Buscar]";
        public static string EliminarViajeEncabezado = "[Viaj].[SP_ViajeEncabezado_Eliminar]";
        public static string ListarViajesEncabezado = "[Viaj].[SP_ViajesEncabezado_Listar]";
        public static string ListarReporteViaje = "[Viaj].[SP_ViajesEncabezado_Reportes]";
        #endregion

        #region Detalle
        public static string InsertarViajeDetalle = "[Viaj].[SP_ViajeDetalle_Insertar]";
        public static string ActualizarViajeDetalle = "[Viaj].[SP_ViajeDetalle_Actualizar]";
        public static string BuscarViajeDetalle = "[Viaj].[SP_ViajeDetalle_Buscar]";
        #endregion

        #region Sucursal
        public static string ListarSucursales = "[Viaj].[SP_Sucursales_Listar]";
        #endregion

        #region Transportista
        public static string ListarTransportistas = "[Viaj].[SP_Transportistas_Listar]";
        #endregion

        #region Colaborador Por Sucursal
        public static string ListarColaboradoresPorSucursal = "[Viaj].[SP_ColaboradoresPorSucursal_Listar]";
        public static string InsertarColaboradoresPorSucursal = "[Viaj].[SP_ColaboradorPorSucursal_Insertar]";
        public static string ActualizarColaboradoresPorSucursal = "[Viaj].[SP_ColaboradorPorSucursal_Actualizar]";
        public static string BuscarColaboradorPorSucursal = "[Viaj].[SP_ColaboradorPorSucursal_Buscar]";
        #endregion
        #endregion
    }
}