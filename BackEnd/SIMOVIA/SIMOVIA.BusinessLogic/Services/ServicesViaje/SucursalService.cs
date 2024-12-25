using SIMOVIA.DataAccess.Repositories.RepositoriesViaje;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.BusinessLogic.Services.ServicesViaje
{
    public class SucursalService
    {
        private readonly SucursalRepository _sucursalRepository;

        /// <summary>
        /// Constructor del servicio de sucursal que inicializa el repositorio de sucursals.
        /// </summary>
        /// <param name="sucursalRepository">Instancia del repositorio de sucursals.</param>
        public SucursalService(SucursalRepository sucursalRepository)
        {
            _sucursalRepository = sucursalRepository;
        }

        /// <summary>
        /// Obtiene una lista de todos los sucursals.
        /// </summary>
        /// <returns>Resultado de la operación con la lista de sucursals.</returns>
        public ServiceResult Listar()
        {
            var result = new ServiceResult();
            try
            {
                var list = _sucursalRepository.List();
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
    }
}
