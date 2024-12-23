using SIMOVIA.DataAccess.Repositories.RepositoriesGeneral;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.BusinessLogic.Services.ServicesGeneral
{
    public class CargoService
    {
        private readonly CargoRepository _cargoRepository;

        /// <summary>
        /// Constructor del servicio de cargo que inicializa el repositorio de cargos.
        /// </summary>
        /// <param name="cargoRepository">Instancia del repositorio de cargos.</param>
        public CargoService(CargoRepository cargoRepository)
        {
            _cargoRepository = cargoRepository;
        }

        /// <summary>
        /// Obtiene una lista de todos los cargos.
        /// </summary>
        /// <returns>Resultado de la operación con la lista de cargos.</returns>
        public ServiceResult Listar()
        {
            var result = new ServiceResult();
            try
            {
                var list = _cargoRepository.List();
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
    }
}
