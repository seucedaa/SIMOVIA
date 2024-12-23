using SIMOVIA.DataAccess.Repositories.RepositoriesGeneral;
using SIMOVIA.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.BusinessLogic.Services.ServicesGeneral
{
    public class ColaboradorService
    {
        private readonly ColaboradorRepository _colaboradorRepository;

        /// <summary>
        /// Constructor del servicio de colaborador que inicializa el repositorio de colaboradores.
        /// </summary>
        /// <param name="colaboradorRepository">Instancia del repositorio de colaboradores.</param>
        public ColaboradorService(ColaboradorRepository colaboradorRepository)
        {
            _colaboradorRepository = colaboradorRepository;
        }

        /// <summary>
        /// Obtiene una lista de todos los colaboraddores.
        /// </summary>
        /// <returns>Resultado de la operación con la lista de colaboradores.</returns>
        public ServiceResult Listar()
        {
            var result = new ServiceResult();
            try
            {
                var list = _colaboradorRepository.List();
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        /// <summary>
        /// Inserta un nuevo colaborador en la base de datos.
        /// </summary>
        /// <param name="item">El objeto tbColaboradores que contiene los datos del colaborador a insertar.</param>
        /// <returns>
        /// Un objeto ServiceResult que indica el resultado de la operación:
        /// - Result = Success y Data contiene el ID del colaborador si la inserción fue exitosa.
        /// - Result = Warning y mensaje asociado si el DNI o el correo ya existe:
        ///   - "DNI existente" si el DNI ya está registrado.
        ///   - "Correo electrónico existente" si el correo ya está registrado.
        /// - Result = Error en caso de un error inesperado durante la operación.
        /// </returns>
        public ServiceResult Insertar(tbColaboradores item)
        {
            var result = new ServiceResult();

            try
            {
                var map = _colaboradorRepository.Insert(item);

                if (map.CodeStatus > 0)
                    return result.Ok(map); 
                else if (map.CodeStatus == -2)
                    return result.Warning("DNI existente."); 
                else if (map.CodeStatus == -3)
                    return result.Warning("Correo electrónico existente.");
                else
                    return result.Error();
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        /// <summary>
        /// Busca un colaborador en la base de datos por su ID.
        /// </summary>
        /// <param name="id">El identificador único del colaborador a buscar.</param>
        /// <returns>
        /// Un objeto ServiceResult que indica el resultado de la operación:
        /// - Result = Success y Data contiene los datos del colaborador si se encuentra.
        /// - Result = Error si ocurre un error inesperado durante la operación.
        /// </returns>
        public ServiceResult Buscar(int id)
        {
            var result = new ServiceResult();
            try
            {
                var map = _colaboradorRepository.Find(id);
                return result.Ok(map);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

    }
}
