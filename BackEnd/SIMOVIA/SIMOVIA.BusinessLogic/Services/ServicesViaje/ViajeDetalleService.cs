using SIMOVIA.DataAccess.Repositories.RepositoriesViaje;
using SIMOVIA.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.BusinessLogic.Services.ServicesViaje
{
    public class ViajeDetalleService
    {
        private readonly ViajeDetalleRepository _viajedetalleRepository;

        /// <summary>
        /// Constructor del servicio de viaje detalle que inicializa el repositorio de viajes detalle.
        /// </summary>
        /// <param name="viajedetalleRepository">Instancia del repositorio de viajes detalle.</param>
        public ViajeDetalleService(ViajeDetalleRepository viajedetalleRepository)
        {
            _viajedetalleRepository = viajedetalleRepository;
        }

        /// <summary>
        /// Inserta un nuevo viaje y sus colaboradores en la base de datos.
        /// </summary>
        /// <param name="item">El objeto `tbViajesDetalle` que contiene el ID del viaje y las colaboradores en formato JSON.</param>
        /// <returns>
        /// Un objeto `ServiceResult` que indica el resultado de la operación:
        /// - Result = Success si la inserción fue exitosa.
        /// - Result = Error si ocurrió un error.
        /// </returns>
        public ServiceResult Insertar(tbViajesDetalle item)
        {
            var result = new ServiceResult();

            try
            {
                var map = _viajedetalleRepository.Insert(item);

                if (map.CodeStatus == 1)
                    return result.Ok(map);
                else
                    return result.Error();
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        /// <summary>
        /// Actualiza un viaje y sus colaboradores en la base de datos.
        /// </summary>
        /// <param name="item">El objeto `tbViajesDetalle` que contiene el ID del viaje y las colaboradores en formato JSON.</param>
        /// <returns>
        /// Un objeto `ServiceResult` que indica el resultado de la operación:
        /// - Result = Success si la actualización fue exitosa.
        /// - Result = Error si ocurrió un error.
        /// </returns>
        public ServiceResult Actualizar(tbViajesDetalle item)
        {
            var result = new ServiceResult();

            try
            {
                var map = _viajedetalleRepository.Update(item);

                if (map.CodeStatus == 1)
                    return result.Ok(map);
                else
                    return result.Error();
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        /// <summary>
        /// Busca un viaje con sus colaboradores en la base de datos por su ID.
        /// </summary>
        /// <param name="id">El identificador único del viaje a buscar.</param>
        /// <returns>
        /// Un objeto ServiceResult que indica el resultado de la operación:
        /// - Result = Success y Data contiene los datos del viaje si se encuentra.
        /// - Result = Error si ocurre un error inesperado durante la operación.
        /// </returns>
        public ServiceResult Buscar(int id)
        {
            var result = new ServiceResult();
            try
            {
                var map = _viajedetalleRepository.Find(id);
                return result.Ok(map);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

    }
}
