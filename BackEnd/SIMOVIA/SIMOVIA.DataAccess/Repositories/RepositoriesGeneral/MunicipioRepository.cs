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
    public class MunicipioRepository : IRepository<tbMunicipios>
    {
        public RequestStatus Delete(int? id)
        {
            throw new NotImplementedException();
        }

        public tbMunicipios Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbMunicipios item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbMunicipios> List()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Obtiene una lista de los municipios por el departamento.
        /// </summary>
        /// <returns>Lista de municipios disponibles.</returns>
        public virtual IEnumerable<tbMunicipios> ListarPorDepartamento(int id)
        {
            List<tbMunicipios> result = new List<tbMunicipios>();
            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@depa_Id", id);
                result = db.Query<tbMunicipios>(ScriptsDataBase.ListarMunicipiosPorDepartamento, parameter, commandType: CommandType.StoredProcedure).ToList();
                return result;
            }
        }

        public RequestStatus Update(tbMunicipios item)
        {
            throw new NotImplementedException();
        }
    }
}
