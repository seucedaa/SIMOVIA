using Dapper;
using Microsoft.Data.SqlClient;
using SIMOVIA.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SIMOVIA.DataAccess;

namespace SIMOVIA.DataAccess.Repositories.RepositoriesGeneral
{
    public class EstadoCivilRepository : IRepository<tbEstadosCiviles>
    {
        public RequestStatus Delete(int? id)
        {
            throw new NotImplementedException();
        }

        public tbEstadosCiviles Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbEstadosCiviles item)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Obtiene una lista de todos los estados civiles.
        /// </summary>
        /// <returns>Lista de estados civiles disponibles.</returns>
        public virtual IEnumerable<tbEstadosCiviles> List()
        {
            List<tbEstadosCiviles> result = new List<tbEstadosCiviles>();
            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                result = db.Query<tbEstadosCiviles>(ScriptsDataBase.ListarEstadosCiviles, commandType: CommandType.Text).ToList();
                return result;
            }
        }

        public RequestStatus Update(tbEstadosCiviles item)
        {
            throw new NotImplementedException();
        }
    }
}
