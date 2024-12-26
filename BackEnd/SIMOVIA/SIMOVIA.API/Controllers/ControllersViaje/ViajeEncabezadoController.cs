using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SIMOVIA.BusinessLogic.Services.ServicesViaje;
using SIMOVIA.Common.Models.ModelsViaje;
using SIMOVIA.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SIMOVIA.API.Controllers.ControllersViaje
{
    [Route("api/[controller]")]
    [ApiController]
    public class ViajeEncabezadoController : Controller
    {
        private readonly ViajeEncabezadoService _viajeService;
        private readonly IMapper _mapper;
        /// <summary>
        /// Constructor del controlador de viaje que inicializa el servicio y el mapeador.
        /// </summary>
        /// <param name="estadocivilService">Instancia del servicio de viajes.</param>
        /// <param name="mapper">Instancia del mapeador para conversiones de modelos.</param>
        public ViajeEncabezadoController(ViajeEncabezadoService viajeService, IMapper mapper)
        {
            _viajeService = viajeService;
            _mapper = mapper;
        }


        /// <summary>
        /// Obtiene una lista de todos los viajes.
        /// </summary>
        /// <returns>Lista de viajes disponibles.</returns>
        [HttpGet("Listar")]
        public IActionResult Listar()
        {
            var response = _viajeService.Listar();
            return Ok(response.Data);
        }

        /// <summary>
        /// Obtiene una lista de todos los viajes.
        /// <param name="tran_Id">ID unico del transportista.</param>
        /// <param name="fechaInicio">Fecha final para obtener los detalles del viaje.</param>
        /// <param name="fechaFin">Fecha final para obtener los detalles del viaje.</param>
        /// </summary>
        /// <returns>Lista de viajes disponibles.</returns>
        [HttpGet("Reporte/{tran_Id}/{fechaInicio}/{fechaFin}")]
        public IActionResult Reporte(int tran_Id, DateTime fechaInicio, DateTime fechaFin)
        {
            var response = _viajeService.Reporte(tran_Id, fechaInicio, fechaFin);
            return Ok(response.Data);
        }

        /// <summary>
        /// Inserta un nuevo viaje en la base de datos.
        /// </summary>
        /// <param name="rolViewModel">El objeto ViajeEncabezadoViewModel que contiene los datos del viaje a insertar.</param>
        /// <returns>
        /// Una respuesta HTTP que contiene el resultado de la operación:
        /// - 200: Si la inserción fue exitosa, devuelve el ID del viaje.
        /// - 202: Si el DNI o el correo electrónico ya existen.
        /// </returns>
        [HttpPost("Insertar")]
        public virtual IActionResult Create(ViajeEncabezadoViewModel rolViewModel)
        {
            var modelo = _mapper.Map<ViajeEncabezadoViewModel, tbViajesEncabezado>(rolViewModel);
            var response = _viajeService.Insertar(modelo);
            return Ok(response);
        }

        /// <summary>
        /// Busca y obtiene los datos de un viaje específico por su ID.
        /// </summary>
        /// <param name="id">El identificador único del viaje a buscar.</param>
        /// <returns>
        /// Una respuesta HTTP que contiene el resultado de la operación:
        /// - 200: Si se encuentra el viaje, devuelve sus datos.
        /// </returns>
        [HttpGet("Buscar/{id}")]
        public IActionResult Buscar(int id)
        {
            var response = _viajeService.Buscar(id);
            return Ok(response.Data);
        }

        /// <summary>
        /// Actualiza un viaje en la base de datos.
        /// </summary>
        /// <param name="viajeViewModel">El objeto ViajeEncabezadoViewModel que contiene los datos del viaje a actualizar.</param>
        /// <returns>
        /// Una respuesta HTTP que contiene el resultado de la operación:
        /// - 200: Si la Actualición fue exitosa, devuelve 1.
        /// - 202: Si el DNI o el correo electrónico ya existen.
        /// </returns>
        [HttpPut("Actualizar")]
        public virtual IActionResult Update(ViajeEncabezadoViewModel viajeViewModel)
        {
            var modelo = _mapper.Map<ViajeEncabezadoViewModel, tbViajesEncabezado>(viajeViewModel);
            var response = _viajeService.Actualizar(modelo);
            return Ok(response);
        }

        /// <summary>
        /// Deshabilita un viaje en la base de datos.
        /// </summary>
        /// <returns>
        /// Una respuesta HTTP que contiene el resultado de la operación:
        /// - 200: Si la Eliminación fue exitosa, devuelve 1.
        /// </returns>
        [HttpDelete("Eliminar")]
        public IActionResult Delete(int id)
        {
            var response = _viajeService.Eliminar(id);
            return Ok(response);
        }
    }
}
