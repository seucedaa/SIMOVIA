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

        public ServiceResult IniciarSesion(string usuario, string clave)
        {
            try
            {
                var userSessionData = _usuarioRepository.InicioSesion(usuario, clave);

                if (userSessionData == null)
                {
                    return new ServiceResult().Unauthorized("Usuario o contraseña incorrectos, o el usuario está inactivo.");
                }

                return new ServiceResult().Ok("Inicio de sesión exitoso.", userSessionData);
            }
            catch (Exception ex)
            {
                return new ServiceResult().Error($"Error al iniciar sesión: {ex.Message}");
            }
        }

    }
}