using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SIMOVIA.DataAccess.Repositories.RepositoriesAcceso;

namespace SIMOVIA.BusinessLogic.Services.ServicesAcceso
{
    public class UsuarioService
    {
        private readonly UsuarioRepository _usuarioRepository;

        /// <summary>
        /// Constructor del servicio de usuario que inicializa el repositorio de usuarios.
        /// </summary>
        /// <param name="usuarioRepository">Instancia del repositorio de usuarios.</param>
        public UsuarioService(UsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        public ServiceResult InicioSesion(string usuario, string clave)
        {
            var result = new ServiceResult();

            try
            {
                var respuesta = _usuarioRepository.InicioSesion(usuario, clave);

                return result.Ok(respuesta);
            }
            catch (Exception ex)
            {
                result.Error(ex.Message);

                throw;
            }
        }
    }
}
