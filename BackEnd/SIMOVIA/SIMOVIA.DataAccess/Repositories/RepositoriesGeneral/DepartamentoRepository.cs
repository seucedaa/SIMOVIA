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
    public class DepartamentoRepository : IRepository<tbDepartamentos>
    {
        public RequestStatus Delete(int? id)
        {
            throw new NotImplementedException();
        }

        public tbDepartamentos Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbDepartamentos item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbDepartamentos> List()
        {
            List<tbDepartamentos> result = new List<tbDepartamentos>();
            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                result = db.Query<tbDepartamentos>(ScriptsDataBase.ListarDepartamentos, commandType: CommandType.Text).ToList();
                return result;
            }
        }

        public RequestStatus Update(tbDepartamentos item)
        {
            throw new NotImplementedException();
        }
    }
}
