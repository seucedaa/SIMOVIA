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
        public object InicioSesion(string usuario, string clave)
        {
            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("usuario", usuario);
                parameters.Add("clave", clave);

                try
                {
                    using (var multi = db.QueryMultiple(ScriptsDataBase.InicioSesionUsuario, parameters, commandType: CommandType.StoredProcedure))
                    {
                        var usuarioData = multi.Read<UsuarioViewModel>().FirstOrDefault();

                        if (usuarioData == null)
                        {
                            return null;
                        }

                        var colaboradorData = multi.IsConsumed ? null : multi.Read<dynamic>().ToList();
                        var pantallasData = multi.IsConsumed ? null : multi.Read<dynamic>().ToList();

                        return new
                        {
                            Usuario = usuarioData,
                            colaborador = colaboradorData,
                            pantallas = pantallasData
                        };
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("Error al ejecutar el procedimiento almacenado: " + ex.Message);
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