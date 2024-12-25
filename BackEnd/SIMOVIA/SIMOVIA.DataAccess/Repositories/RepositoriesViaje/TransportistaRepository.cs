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
    public class TransportistaRepository : IRepository<tbTransportistas>
    {
        public RequestStatus Delete(int? id)
        {
            throw new NotImplementedException();
        }

        public tbTransportistas Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbTransportistas item)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Obtiene una lista de todos los transportistas.
        /// </summary>
        /// <returns>Lista de transportistas disponibles.</returns>
        public virtual IEnumerable<tbTransportistas> List()
        {
            List<tbTransportistas> result = new List<tbTransportistas>();
            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                result = db.Query<tbTransportistas>(ScriptsDataBase.ListarTransportistas, commandType: CommandType.Text).ToList();
                return result;
            }
        }

        public RequestStatus Update(tbTransportistas item)
        {
            throw new NotImplementedException();
        }
    }
}
