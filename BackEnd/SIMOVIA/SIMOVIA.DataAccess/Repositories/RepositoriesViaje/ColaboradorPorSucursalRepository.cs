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
    public class ColaboradorPorSucursalRepository : IRepository<tbColaboradoresPorSucursal>
    {
        public RequestStatus Delete(int? id)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Busca y devuelve un registro de colaborador con sus sucursales basado en su ID.
        /// </summary>
        /// <param name="id">El identificador único del colaborador a buscar.</param>
        /// <returns>
        /// Un objeto de tipo tbColaboradores que contiene todos los datos del colaborador encontrado.
        /// Si no se encuentra un registro con el ID especificado, devuelve un objeto vacío.
        /// </returns>
        public IEnumerable<tbColaboradoresPorSucursal> Find(int? id)
        {
            List<tbColaboradoresPorSucursal> result = new List<tbColaboradoresPorSucursal>();

            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@cola_Id", id);
                result = db.Query<tbColaboradoresPorSucursal>(ScriptsDataBase.BuscarColaboradorPorSucursal, parameter, commandType: CommandType.StoredProcedure).ToList();
                return result;
            }
        }

        /// <summary>
        /// Inserta un nuevo registro de colaborador y sucursales en la base de datos.
        /// </summary>
        /// <param name="item">El objeto `tbColaboradoresPorSucursal` que contiene el ID del colaborador y las sucursales en formato JSON.</param>
        /// <returns>
        /// Un objeto `RequestStatus` que indica el resultado de la operación:
        /// - CodeStatus > 1: Inserción exitosa.
        /// - CodeStatus = 0: Error inesperado durante la operación.
        /// </returns>
        public RequestStatus Insert(tbColaboradoresPorSucursal item)
        {
            RequestStatus result = new RequestStatus();

            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@cola_Id", item.cola_Id);
                parameter.Add("@sucursalesJSON", item.sucursalesJSON);

                var answer = db.QueryFirst<int>(
                    ScriptsDataBase.InsertarColaboradoresPorSucursal,
                    parameter,
                    commandType: CommandType.StoredProcedure
                );

                result.CodeStatus = answer;
                return result;
            }
        }


        public IEnumerable<tbColaboradoresPorSucursal> List()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Obtiene una lista de los colaboradores por la sucursal.
        /// </summary>
        /// <returns>Lista de colaboradores disponibles.</returns>
        public virtual IEnumerable<tbColaboradoresPorSucursal> ListarPorSucursal(int id)
        {
            List<tbColaboradoresPorSucursal> result = new List<tbColaboradoresPorSucursal>();
            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@sucu_Id", id);
                result = db.Query<tbColaboradoresPorSucursal>(ScriptsDataBase.ListarColaboradoresPorSucursal, parameter, commandType: CommandType.StoredProcedure).ToList();
                return result;
            }
        }

        /// <summary>
        /// Actualiza un registro existente de colaborador y sucursales en la base de datos.
        /// </summary>
        /// <param name="item">El objeto `tbColaboradoresPorSucursal` que contiene el ID del colaborador y las sucursales en formato JSON.</param>
        /// <returns>
        /// Un objeto `RequestStatus` que indica el resultado de la operación:
        /// - CodeStatus = 1: Actualización exitosa.
        /// - CodeStatus = 0: Error inesperado durante la operación.
        /// </returns>
        public RequestStatus Update(tbColaboradoresPorSucursal item)
        {
            RequestStatus result = new RequestStatus();

            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@cola_Id", item.cola_Id);
                parameter.Add("@sucursalesJSON", item.sucursalesJSON);

                var answer = db.QueryFirst<int>(
                    ScriptsDataBase.ActualizarColaboradoresPorSucursal,
                    parameter,
                    commandType: CommandType.StoredProcedure
                );

                result.CodeStatus = answer;
                return result;
            }
        }

        tbColaboradoresPorSucursal IRepository<tbColaboradoresPorSucursal>.Find(int? id)
        {
            throw new NotImplementedException();
        }
    }
}
