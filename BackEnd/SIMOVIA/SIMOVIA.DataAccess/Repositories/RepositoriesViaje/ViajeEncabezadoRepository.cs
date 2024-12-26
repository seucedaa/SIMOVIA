using Microsoft.Data.SqlClient;
using SIMOVIA.Entities.Entities;
using System;
using System.Collections.Generic;
using Dapper;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.DataAccess.Repositories.RepositoriesViaje
{
    public class ViajeEncabezadoRepository : IRepository<tbViajesEncabezado>
    {
        /// <summary>
        /// Deshabilita un registro de viaje encabezado basado en su ID.
        /// </summary>
        /// <param name="id">El identificador único del viaje encabezado a deshabilitar.</param>
        public RequestStatus Delete(int? id)
        {
            RequestStatus result = new RequestStatus();

            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@vien_Id", id);

                var answer = db.QueryFirst<int>(
                    ScriptsDataBase.EliminarViajeEncabezado,
                    parameter,
                    commandType: CommandType.StoredProcedure
                );

                result.CodeStatus = answer;
                return result;
            }
        }

        /// <summary>
        /// Busca y devuelve un registro de viaje encabezado basado en su ID.
        /// </summary>
        /// <param name="id">El identificador único del viaje encabezado a buscar.</param>
        /// <returns>
        /// Un objeto de tipo tbViajesEncabezado que contiene todos los datos del viaje encabezado encontrado.
        /// Si no se encuentra un registro con el ID especificado, devuelve un objeto vacío.
        /// </returns>
        public tbViajesEncabezado Find(int? id)
        {
            tbViajesEncabezado result = new tbViajesEncabezado();

            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@vien_Id", id);
                result = db.QueryFirst<tbViajesEncabezado>(ScriptsDataBase.BuscarViajeEncabezado, parameter, commandType: CommandType.StoredProcedure);
                return result;
            }
        }


        /// <summary>
        /// Inserta un nuevo viaje encabezado en la base de datos mediante un procedimiento almacenado.
        /// </summary>
        /// <param name="item">El objeto tbViajesEncabezado que contiene los datos del viaje encabezado a insertar.</param>
        /// <returns>
        /// Un objeto RequestStatus que indica el resultado de la operación:
        /// -CodeStatus > 0: Inserción exitosa, devuelve el ID del viaje encabezado insertado.
        /// -CodeStatus = -2: El DNI ya está registrado.
        /// -CodeStatus = -3: El correo electrónico ya está registrado.
        /// -CodeStatus = 0: Error inesperado durante la operación.
        /// </returns>
        public RequestStatus Insert(tbViajesEncabezado item)
        {
            RequestStatus result = new RequestStatus();

            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@vien_DistanciaTotalkm", item.vien_DistanciaTotalkm);
                parameter.Add("@vien_Fecha", item.vien_Fecha);
                parameter.Add("@vien_Total", item.vien_Total);
                parameter.Add("@sucu_Id", item.sucu_Id);
                parameter.Add("@tran_Id", item.tran_Id);
                parameter.Add("@vien_UsuarioCreacion", item.vien_UsuarioCreacion);
                parameter.Add("@vien_FechaCreacion", DateTime.Now);

                var answer = db.QueryFirst<int>(
                    ScriptsDataBase.InsertarViajeEncabezado,
                    parameter,
                    commandType: CommandType.StoredProcedure
                );

                result.CodeStatus = answer;
                return result;
            }
        }

        /// <summary>
        /// Obtiene una lista de todos los viajes.
        /// </summary>
        /// <returns>Lista de viajes disponibles.</returns>
        public virtual IEnumerable<tbViajesEncabezado> List()
        {
            List<tbViajesEncabezado> result = new List<tbViajesEncabezado>();
            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                result = db.Query<tbViajesEncabezado>(ScriptsDataBase.ListarViajesEncabezado, commandType: CommandType.Text).ToList();
                return result;
            }
        }


        /// <summary>
        /// Obtiene una lista de  los viajes con sus detalles.
        /// </summary>
        /// <returns>Lista de viajes.</returns>
        public virtual IEnumerable<tbViajesEncabezado> Report(int tran_Id, DateTime fechaInicio, DateTime fechafin)
        {
            List<tbViajesEncabezado> result = new List<tbViajesEncabezado>();
            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@tran_Id", tran_Id);
                parameter.Add("@fechaInicio", fechaInicio);
                parameter.Add("@fechafin", fechafin);
                result = db.Query<tbViajesEncabezado>(ScriptsDataBase.ListarReporteViaje, parameter, commandType: CommandType.StoredProcedure).ToList();
                return result;
            }
        }
        /// <summary>
        /// Actualiza un registro de viaje encabezado en la base de datos.
        /// </summary>
        /// <param name="item">El objeto `tbViajesEncabezado` que contiene los datos del viaje encabezado</param>
        /// <returns>
        /// Un objeto `RequestStatus` que indica el resultado de la operación:
        /// - CodeStatus = 1: Actualización exitosa.
        /// - CodeStatus = 0: Error inesperado durante la operación.
        /// </returns>
        public RequestStatus Update(tbViajesEncabezado item)
        {
            RequestStatus result = new RequestStatus();

            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@vien_Id", item.vien_Id);
                parameter.Add("@vien_DistanciaTotalkm", item.vien_DistanciaTotalkm);
                parameter.Add("@vien_Total", item.vien_Total);
                parameter.Add("@vien_UsuarioModificacion", item.vien_UsuarioModificacion);
                parameter.Add("@vien_FechaModificacion", DateTime.Now);

                var answer = db.QueryFirst<int>(
                    ScriptsDataBase.ActualizarViajeEncabezado,
                    parameter,
                    commandType: CommandType.StoredProcedure
                );

                result.CodeStatus = answer;
                return result;
            }
        }
    }
}
