using Dapper;
using Microsoft.Data.SqlClient;
using SIMOVIA.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.DataAccess.Repositories.RepositoriesGeneral
{
    public class CargoRepository : IRepository<tbCargos>
    {
        public RequestStatus Delete(int? id)
        {
            throw new NotImplementedException();
        }

        public tbCargos Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbCargos item)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Obtiene una lista de los cargos.
        /// </summary>
        /// <returns>Lista de cargos disponibles.</returns>
        public IEnumerable<tbCargos> List()
        {
            List<tbCargos> result = new List<tbCargos>();
            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                result = db.Query<tbCargos>(ScriptsDataBase.ListarCargos, commandType: CommandType.Text).ToList();
                return result;
            }
        }

        public RequestStatus Update(tbCargos item)
        {
            throw new NotImplementedException();
        }
    }
}
