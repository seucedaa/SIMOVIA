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
    public class ViajeDetalleController : Controller
    {
        private readonly ViajeDetalleService _viajeDetalleService;
        private readonly IMapper _mapper;
        /// <summary>
        /// Constructor del controlador de viaje detalle que inicializa el servicio y el mapeador.
        /// </summary>
        /// <param name="viajeDetalleService">Instancia del servicio de viajees por sucursal.</param>
        /// <param name="mapper">Instancia del mapeador para conversiones de modelos.</param>
        public ViajeDetalleController(ViajeDetalleService viajeDetalleService, IMapper mapper)
        {
            _viajeDetalleService = viajeDetalleService;
            _mapper = mapper;
        }

        /// <summary>
        /// Inserta un viaje y los colaboradores relacionadas en la base de datos.
        /// </summary>
        /// <param name="viajeDetalleViewModel">El objeto `ViajeDetalleViewModel` que contiene los datos del viaje y colaboradores.</param>
        /// <returns>
        /// Una respuesta HTTP que contiene el resultado de la operación:
        /// - 200: Si la inserción fue exitosa.
        /// </returns>
        [HttpPost("Insertar")]
        public virtual IActionResult Create(ViajeDetalleViewModel viajeDetalleViewModel)
        {
            viajeDetalleViewModel.colaboradoresJSON = Newtonsoft.Json.JsonConvert.SerializeObject(
                viajeDetalleViewModel.colaboradores 
            );

            var modelo = _mapper.Map<ViajeDetalleViewModel, tbViajesDetalle>(viajeDetalleViewModel);
            var response = _viajeDetalleService.Insertar(modelo);
            return Ok(response);
        }

        /// <summary>
        /// Actualiza un viaje y las colaboradores relacionadas en la base de datos.
        /// </summary>
        /// <param name="viajeDetalleViewModel">El objeto `ViajeDetalleViewModel` que contiene los datos del viaje y colaboradores.</param>
        /// <returns>
        /// Una respuesta HTTP que contiene el resultado de la operación:
        /// - 200: Si la actualización fue exitosa.
        /// </returns>
        [HttpPut("Actualizar")]
        public virtual IActionResult Update(ViajeDetalleViewModel viajeDetalleViewModel)
        {
            viajeDetalleViewModel.colaboradoresJSON = Newtonsoft.Json.JsonConvert.SerializeObject(
                viajeDetalleViewModel.colaboradores 
            );

            var modelo = _mapper.Map<ViajeDetalleViewModel, tbViajesDetalle>(viajeDetalleViewModel);
            var response = _viajeDetalleService.Actualizar(modelo);
            return Ok(response);
        }

        /// <summary>
        /// Busca y obtiene los datos de un viaje y sus colaboradores específico por su ID.
        /// </summary>
        /// <param name="id">El identificador único del viaje a buscar.</param>
        /// <returns>
        /// Una respuesta HTTP que contiene el resultado de la operación:
        /// - 200: Si se encuentra el viaje, devuelve sus datos.
        /// </returns>
        [HttpGet("Buscar/{id}")]
        public IActionResult Buscar(int id)
        {
            var response = _viajeDetalleService.Buscar(id);
            return Ok(response.Data);
        }
    }
}
