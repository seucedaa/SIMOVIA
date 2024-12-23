using SIMOVIA.DataAccess.Repositories.RepositoriesGeneral;
using SIMOVIA.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.BusinessLogic.Services.ServicesGeneral
{
    public class EstadoCivilService
    {
        private readonly EstadoCivilRepository _estadocivilRepository;
        /// <summary>
        /// Constructor del servicio de estado civil que inicializa el repositorio de estados civiles.
        /// </summary>
        /// <param name="estadocivilRepository">Instancia del repositorio de estados civiles.</param>
        public EstadoCivilService(EstadoCivilRepository estadocivilRepository)
        {
            _estadocivilRepository = estadocivilRepository;
        }

        /// <summary>
        /// Obtiene una lista de todos los estados civiles.
        /// </summary>
        /// <returns>Resultado de la operación con la lista de estados civiles.</returns>
        public ServiceResult Listar()
        {
            var result = new ServiceResult();
            try
            {
                var list = _estadocivilRepository.List();
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
    }
}
