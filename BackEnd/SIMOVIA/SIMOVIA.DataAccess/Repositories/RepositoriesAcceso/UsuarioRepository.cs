using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.SqlClient;
using SIMOVIA.Common.Models.ModelsAcceso;
using SIMOVIA.Entities.Entities;
using SIMOVIA.DataAccess;

namespace SIMOVIA.DataAccess.Repositories.RepositoriesAcceso
{
    public class UsuarioRepository : IRepository<tbUsuarios>
    {

        public IEnumerable<UsuarioViewModel> InicioSesion(string usuario, string clave)
        {
            {
                List<UsuarioViewModel> result = new List<UsuarioViewModel>();

                using (var db = new SqlConnection(SIMOVIA.ConnectionString))
                {
                    var parametro = new DynamicParameters();
                    parametro.Add("usuario", usuario);
                    parametro.Add("clave", clave);

                    result = db.Query<UsuarioViewModel>(ScriptsDataBase.InicioSesionUsuario, parametro, commandType: CommandType.StoredProcedure).ToList();

                    return result;
                }
            }
        }

        public RequestStatus Delete(int? id)
        {
            throw new NotImplementedException();
        }

        public tbUsuarios Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbUsuarios item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbUsuarios> List()
        {
            throw new NotImplementedException();
        }

        public RequestStatus Update(tbUsuarios item)
        {
            throw new NotImplementedException();
        }
    }
}
