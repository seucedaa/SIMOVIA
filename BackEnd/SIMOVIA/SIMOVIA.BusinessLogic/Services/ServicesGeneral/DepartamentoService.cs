using SIMOVIA.DataAccess.Repositories.RepositoriesGeneral;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.BusinessLogic.Services.ServicesGeneral
{
    public class DepartamentoService
    {
        private readonly DepartamentoRepository _departamentoRepository;

        /// <summary>
        /// Constructor del servicio de departamento que inicializa el repositorio de departamentos.
        /// </summary>
        /// <param name="departamentoRepository">Instancia del repositorio de departamentos.</param>
        public DepartamentoService(DepartamentoRepository departamentoRepository)
        {
            _departamentoRepository = departamentoRepository;
        }

        /// <summary>
        /// Obtiene una lista de todos los departamentos.
        /// </summary>
        /// <returns>Resultado de la operación con la lista de departamentos.</returns>
        public ServiceResult Listar()
        {
            var result = new ServiceResult();
            try
            {
                var list = _departamentoRepository.List();
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }
    }
}
