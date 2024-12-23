using Microsoft.Data.SqlClient;
using SIMOVIA.Entities.Entities;
using System;
using System.Collections.Generic;
using Dapper;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.DataAccess.Repositories.RepositoriesGeneral
{
    public class ColaboradorRepository : IRepository<tbColaboradores>
    {
        public RequestStatus Delete(int? id)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Busca y devuelve un registro de colaborador basado en su ID.
        /// </summary>
        /// <param name="id">El identificador único del colaborador a buscar.</param>
        /// <returns>
        /// Un objeto de tipo tbColaboradores que contiene todos los datos del colaborador encontrado.
        /// Si no se encuentra un registro con el ID especificado, devuelve un objeto vacío.
        /// </returns>
        public tbColaboradores Find(int? id)
        {
            tbColaboradores result = new tbColaboradores();

            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@cola_Id", id);
                result = db.QueryFirst<tbColaboradores>(ScriptsDataBase.BuscarColaborador, parameter, commandType: CommandType.StoredProcedure);
                return result;
            }
        }


        /// <summary>
        /// Inserta un nuevo colaborador en la base de datos mediante un procedimiento almacenado.
        /// </summary>
        /// <param name="item">El objeto tbColaboradores que contiene los datos del colaborador a insertar.</param>
        /// <returns>
        /// Un objeto RequestStatus que indica el resultado de la operación:
        /// -CodeStatus > 0: Inserción exitosa, devuelve el ID del colaborador insertado.
        /// -CodeStatus = -2: El DNI ya está registrado.
        /// -CodeStatus = -3: El correo electrónico ya está registrado.
        /// -CodeStatus = 0: Error inesperado durante la operación.
        /// </returns>
        public RequestStatus Insert(tbColaboradores item)
        {
            RequestStatus result = new RequestStatus();

            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                var parameter = new DynamicParameters();
                parameter.Add("@cola_DNI", item.cola_DNI);
                parameter.Add("@cola_Nombres", item.cola_Nombres);
                parameter.Add("@cola_Apellidos", item.cola_Apellidos);
                parameter.Add("@cola_CorreoElectronico", item.cola_CorreoElectronico);
                parameter.Add("@cola_Telefono", item.cola_Telefono);
                parameter.Add("@cola_Sexo", item.cola_Sexo);
                parameter.Add("@cola_FechaNacimiento", item.cola_FechaNacimiento);
                parameter.Add("@muni_Id", item.muni_Id);
                parameter.Add("@civi_Id", item.civi_Id);
                parameter.Add("@carg_Id", item.carg_Id);
                parameter.Add("@cola_UsuarioCreacion", item.cola_UsuarioCreacion);
                parameter.Add("@cola_FechaCreacion", DateTime.Now);

                var answer = db.QueryFirst<int>(
                    ScriptsDataBase.InsertarColaborador,
                    parameter,
                    commandType: CommandType.StoredProcedure
                );

                result.CodeStatus = answer;
                return result;
            }
        }

        /// <summary>
        /// Obtiene una lista de todos los colaboradores.
        /// </summary>
        /// <returns>Lista de colaboradores disponibles.</returns>
        public virtual IEnumerable<tbColaboradores> List()
        {
            List<tbColaboradores> result = new List<tbColaboradores>();
            using (var db = new SqlConnection(SIMOVIA.ConnectionString))
            {
                result = db.Query<tbColaboradores>(ScriptsDataBase.ListarColaboradores, commandType: CommandType.Text).ToList();
                return result;
            }
        }

        public RequestStatus Update(tbColaboradores item)
        {
            throw new NotImplementedException();
        }
    }
}
