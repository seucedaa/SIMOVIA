using Dapper;
using Microsoft.Data.SqlClient;
using SIMOVIA.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.DataAccess.Repositories.RepositoriesViaje
{
    public class ViajeDetalleRepository : IRepository<tbViajesDetalle>
    {
        public RequestStatus Delete(int? id)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Busca y devuelve un registro de viaje con sus colaboradores basado en su ID.
        /// </summary>
        /// <param name="id">El identificador único del viaje a buscar.</param>
        /// <returns>
        /// Un objeto de tipo tbViajesDetalle que contiene todos los datos del viaje encontrado.
        /// Si no se encuentra un registro con el ID especificado, devuelve un objeto vacío.
        /// </returns>
        public IEnumerable<tbViajesDetalle> Find(int? id)
        {
            List<tbViajesDetalle> result = new List<tbViajesDetalle>();

            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@vien_Id", id);
                result = db.Query<tbViajesDetalle>(ScriptsDataBase.BuscarViajeDetalle, parameter, commandType: CommandType.StoredProcedure).ToList();
                return result;
            }
        }

        /// <summary>
        /// Inserta un nuevo registro de viaje y colaboradores en la base de datos.
        /// </summary>
        /// <param name="item">El objeto `tbViajesDetalle` que contiene el ID del viaje y los colaboradores en formato JSON.</param>
        /// <returns>
        /// Un objeto `RequestStatus` que indica el resultado de la operación:
        /// - CodeStatus > 1: Inserción exitosa.
        /// - CodeStatus = 0: Error inesperado durante la operación.
        /// </returns>
        public RequestStatus Insert(tbViajesDetalle item)
        {
            RequestStatus result = new RequestStatus();

            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@vien_Id", item.vien_Id);
                parameter.Add("@colaboradoresJSON", item.colaboradoresJSON);

                var answer = db.QueryFirst<int>(
                    ScriptsDataBase.InsertarViajeDetalle,
                    parameter,
                    commandType: CommandType.StoredProcedure
                );

                result.CodeStatus = answer;
                return result;
            }
        }


        public IEnumerable<tbViajesDetalle> List()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Actualiza un registro existente de viaje y colaboradores en la base de datos.
        /// </summary>
        /// <param name="item">El objeto `tbViajesDetalle` que contiene el ID del viaje y las colaboradores en formato JSON.</param>
        /// <returns>
        /// Un objeto `RequestStatus` que indica el resultado de la operación:
        /// - CodeStatus = 1: Actualización exitosa.
        /// - CodeStatus = 0: Error inesperado durante la operación.
        /// </returns>
        public RequestStatus Update(tbViajesDetalle item)
        {
            RequestStatus result = new RequestStatus();

            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@vien_Id", item.vien_Id);
                parameter.Add("@colaboradoresJSON", item.colaboradoresJSON);

                var answer = db.QueryFirst<int>(
                    ScriptsDataBase.ActualizarViajeDetalle,
                    parameter,
                    commandType: CommandType.StoredProcedure
                );

                result.CodeStatus = answer;
                return result;
            }
        }

        tbViajesDetalle IRepository<tbViajesDetalle>.Find(int? id)
        {
            throw new NotImplementedException();
        }
    }
}
