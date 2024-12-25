using SIMOVIA.DataAccess.Repositories.RepositoriesViaje;
using SIMOVIA.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.BusinessLogic.Services.ServicesViaje
{
    public class ColaboradorPorSucursalService
    {
        private readonly ColaboradorPorSucursalRepository _colaboradorporsucursalRepository;

        /// <summary>
        /// Constructor del servicio de colaborador por sucursal que inicializa el repositorio de colaborador por sucursales.
        /// </summary>
        /// <param name="colaboradorporsucursalRepository">Instancia del repositorio de colaborador por sucursales.</param>
        public ColaboradorPorSucursalService(ColaboradorPorSucursalRepository colaboradorporsucursalRepository)
        {
            _colaboradorporsucursalRepository = colaboradorporsucursalRepository;
        }

        /// <summary>
        /// Obtiene una lista de todos los colaboradores filtrados por la sucursal  seleccionado.
        /// </summary>
        /// <returns>Resultado de la operación con la lista de sucursales.</returns>
        public ServiceResult ListarPorSucursal(int id)
        {
            var result = new ServiceResult();
            try
            {
                var list = _colaboradorporsucursalRepository.ListarPorSucursal(id);
                return result.Ok(list);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

        /// <summary>
        /// Inserta un nuevo colaborador y sus sucursales en la base de datos.
        /// </summary>
        /// <param name="item">El objeto `tbColaboradoresPorSucursal` que contiene el ID del colaborador y las sucursales en formato JSON.</param>
        /// <returns>
        /// Un objeto `ServiceResult` que indica el resultado de la operación:
        /// - Result = Success si la inserción fue exitosa.
        /// - Result = Error si ocurrió un error.
        /// </returns>
        public ServiceResult Insertar(tbColaboradoresPorSucursal item)
        {
            var result = new ServiceResult();

            try
            {
                var map = _colaboradorporsucursalRepository.Insert(item);

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
        /// Actualiza un colaborador y sus sucursales en la base de datos.
        /// </summary>
        /// <param name="item">El objeto `tbColaboradoresPorSucursal` que contiene el ID del colaborador y las sucursales en formato JSON.</param>
        /// <returns>
        /// Un objeto `ServiceResult` que indica el resultado de la operación:
        /// - Result = Success si la actualización fue exitosa.
        /// - Result = Error si ocurrió un error.
        /// </returns>
        public ServiceResult Actualizar(tbColaboradoresPorSucursal item)
        {
            var result = new ServiceResult();

            try
            {
                var map = _colaboradorporsucursalRepository.Update(item);

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
        /// Busca un colaborador con sus sucursales en la base de datos por su ID.
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
                var map = _colaboradorporsucursalRepository.Find(id);
                return result.Ok(map);
            }
            catch (Exception ex)
            {
                return result.Error(ex.Message);
            }
        }

    }
}
