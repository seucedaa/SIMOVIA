using SIMOVIA.DataAccess.Repositories.RepositoriesGeneral;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.BusinessLogic.Services.ServicesGeneral
{
    public class MunicipioService
    {
        private readonly MunicipioRepository _municipioRepository;

        /// <summary>
        /// Constructor del servicio de municipio que inicializa el repositorio de municipios.
        /// </summary>
        /// <param name="municipioRepository">Instancia del repositorio de municipios.</param>
        public MunicipioService(MunicipioRepository municipioRepository)
        {
            _municipioRepository = municipioRepository;
        }

        /// <summary>
        /// Obtiene una lista de todos los municipios filtrados por el departamento seleccionado.
        /// </summary>
        /// <returns>Resultado de la operación con la lista de departamentos.</returns>
        public ServiceResult ListarPorDepartamento(int id)
        {
            var result = new ServiceResult();
            try
            {
                var list = _municipioRepository.ListarPorDepartamento(id);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
    }
}
