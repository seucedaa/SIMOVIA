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
    public class SucursalRepository : IRepository<tbSucursales>
    {
        public RequestStatus Delete(int? id)
        {
            throw new NotImplementedException();
        }

        public tbSucursales Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbSucursales item)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Obtiene una lista de todos las sucursales.
        /// </summary>
        /// <returns>Lista de sucursales disponibles.</returns>
        public virtual IEnumerable<tbSucursales> List()
        {
            List<tbSucursales> result = new List<tbSucursales>();
            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                result = db.Query<tbSucursales>(ScriptsDataBase.ListarSucursales, commandType: CommandType.Text).ToList();
                return result;
            }
        }

        public RequestStatus Update(tbSucursales item)
        {
            throw new NotImplementedException();
        }
    }
}
