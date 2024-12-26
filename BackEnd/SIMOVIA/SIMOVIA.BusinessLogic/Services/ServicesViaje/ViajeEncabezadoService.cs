using SIMOVIA.DataAccess.Repositories.RepositoriesViaje;
using SIMOVIA.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.BusinessLogic.Services.ServicesViaje
{
    public class ViajeEncabezadoService
    {
        private readonly ViajeEncabezadoRepository _viajeRepository;

        /// <summary>
        /// Constructor del servicio de viaje que inicializa el repositorio de viajes.
        /// </summary>
        /// <param name="viajeRepository">Instancia del repositorio de viajes.</param>
        public ViajeEncabezadoService(ViajeEncabezadoRepository viajeRepository)
        {
            _viajeRepository = viajeRepository;
        }

        /// <summary>
        /// Obtiene una lista de todos los colaboraddores.
        /// </summary>
        /// <returns>Resultado de la operación con la lista de viajes.</returns>
        public ServiceResult Listar()
        {
            var result = new ServiceResult();
            try
            {
                var list = _viajeRepository.List();
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        /// <summary>
        /// Inserta un nuevo viaje en la base de datos.
        /// </summary>
        /// <param name="item">El objeto tbViajesEncabezado que contiene los datos del viaje a insertar.</param>
        /// <returns>
        /// Un objeto ServiceResult que indica el resultado de la operación:
        /// - Result = Success y Data contiene el ID del viaje si la inserción fue exitosa.
        /// - Result = Error en caso de un error inesperado durante la operación.
        /// </returns>
        public ServiceResult Insertar(tbViajesEncabezado item)
        {
            var result = new ServiceResult();

            try
            {
                var map = _viajeRepository.Insert(item);

                if (map.CodeStatus > 0)
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
        /// Busca detalles de un viaje en la base de datos para el reporte.
        /// </summary>
        /// <param name="tran_Id">El identificador único del transportista.</param>
        /// <param name="fechaInicio">Fecha inicial para obtener los detalles del viaje.</param>
        /// <param name="fechaFin">Fecha final para obtener los detalles del viaje.</param>
        /// <returns>
        /// Un objeto ServiceResult que indica el resultado de la operación:
        /// - Result = Success y Data contiene los datos del viaje.
        /// - Result = Error si ocurre un error inesperado durante la operación.
        /// </returns>
        public ServiceResult Reporte(int tran_Id, DateTime fechaInicio, DateTime fechaFin)
        {
            var result = new ServiceResult();
            try
            {
                var map = _viajeRepository.Report(tran_Id, fechaInicio, fechaFin);
                return result.Ok(map);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        /// <summary>
        /// Busca un viaje en la base de datos por su ID.
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
                var map = _viajeRepository.Find(id);
                return result.Ok(map);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        /// <summary>
        /// Actualiza un viaje en la base de datos.
        /// </summary>
        /// <param name="item">El objeto `tbViajesEncabezado` que contiene los datos del viaje.</param>
        /// <returns>
        /// Un objeto `ServiceResult` que indica el resultado de la operación:
        /// - Result = Success si la actualización fue exitosa.
        /// - Result = Error si ocurrió un error.
        /// </returns>
        public ServiceResult Actualizar(tbViajesEncabezado item)
        {
            var result = new ServiceResult();

            try
            {
                var map = _viajeRepository.Update(item);

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
        /// Deshabilita un rol específico en la base de datos.
        /// </summary>
        /// <param name="id">El ID de la relación a eliminar.</param>
        /// <returns>Un objeto ServiceResult que indica el resultado de la operación.</returns>
        public ServiceResult Eliminar(int id)
        {
            var result = new ServiceResult();

            try
            {
                var response = _viajeRepository.Delete(id);

                var map = _viajeRepository.Delete(id);

                if (map.CodeStatus == 1)
                {
                    return result.Ok(map);
                }
                else
                {
                    return result.Error(map);
                }
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

    }
}
