using SIMOVIA.DataAccess.Repositories.RepositoriesViaje;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.BusinessLogic.Services.ServicesViaje
{
    public class TransportistaService
    {
        private readonly TransportistaRepository _transportistaRepository;

        /// <summary>
        /// Constructor del servicio de transportista que inicializa el repositorio de transportistas.
        /// </summary>
        /// <param name="transportistaRepository">Instancia del repositorio de transportistas.</param>
        public TransportistaService(TransportistaRepository transportistaRepository)
        {
            _transportistaRepository = transportistaRepository;
        }

        /// <summary>
        /// Obtiene una lista de todos los transportistas.
        /// </summary>
        /// <returns>Resultado de la operación con la lista de transportistas.</returns>
        public ServiceResult Listar()
        {
            var result = new ServiceResult();
            try
            {
                var list = _transportistaRepository.List();
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
    }
}
