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
    public class ColaboradorPorSucursalController : Controller
    {
        private readonly ColaboradorPorSucursalService _colaboradorPorSucursalService;
        private readonly IMapper _mapper;
        /// <summary>
        /// Constructor del controlador de colaborador por sucursal que inicializa el servicio y el mapeador.
        /// </summary>
        /// <param name="colaboradorPorSucursalService">Instancia del servicio de colaboradores por sucursal.</param>
        /// <param name="mapper">Instancia del mapeador para conversiones de modelos.</param>
        public ColaboradorPorSucursalController(ColaboradorPorSucursalService colaboradorPorSucursalService, IMapper mapper)
        {
            _colaboradorPorSucursalService = colaboradorPorSucursalService;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene una lista de todos los colaboradores filtrados por la sucursal seleccionada.
        /// </summary>
        /// <returns>Lista de colaboradores disponibles.</returns>
        [HttpGet("ListarPorSucursal/{id}")]
        public IActionResult ListarPorSucursal(int id)
        {
            var response = _colaboradorPorSucursalService.ListarPorSucursal(id);
            return Ok(response.Data);
        }

        /// <summary>
        /// Inserta un colaborador y las sucursales relacionadas en la base de datos.
        /// </summary>
        /// <param name="colaboradorPorSucursalViewModel">El objeto `ColaboradorPorSucursalViewModel` que contiene los datos del colaborador y sucursales.</param>
        /// <returns>
        /// Una respuesta HTTP que contiene el resultado de la operación:
        /// - 200: Si la inserción fue exitosa.
        /// </returns>
        [HttpPost("Insertar")]
        public virtual IActionResult Create(ColaboradorPorSucursalViewModel colaboradorPorSucursalViewModel)
        {
            colaboradorPorSucursalViewModel.sucursalesJSON = Newtonsoft.Json.JsonConvert.SerializeObject(
                colaboradorPorSucursalViewModel.sucursales // Serializar la lista de sucursales, no sucursalesJSON
            );

            var modelo = _mapper.Map<ColaboradorPorSucursalViewModel, tbColaboradoresPorSucursal>(colaboradorPorSucursalViewModel);
            var response = _colaboradorPorSucursalService.Insertar(modelo);
            return Ok(response);
        }

        /// <summary>
        /// Actualiza un colaborador y las sucursales relacionadas en la base de datos.
        /// </summary>
        /// <param name="colaboradorPorSucursalViewModel">El objeto `ColaboradorPorSucursalViewModel` que contiene los datos del colaborador y sucursales.</param>
        /// <returns>
        /// Una respuesta HTTP que contiene el resultado de la operación:
        /// - 200: Si la actualización fue exitosa.
        /// </returns>
        [HttpPut("Actualizar")]
        public virtual IActionResult Update(ColaboradorPorSucursalViewModel colaboradorPorSucursalViewModel)
        {
            colaboradorPorSucursalViewModel.sucursalesJSON = Newtonsoft.Json.JsonConvert.SerializeObject(
                colaboradorPorSucursalViewModel.sucursales // Serializar la lista de sucursales, no sucursalesJSON
            );

            var modelo = _mapper.Map<ColaboradorPorSucursalViewModel, tbColaboradoresPorSucursal>(colaboradorPorSucursalViewModel);
            var response = _colaboradorPorSucursalService.Actualizar(modelo);
            return Ok(response);
        }

        /// <summary>
        /// Busca y obtiene los datos de un colaborador y sus sucursales específico por su ID.
        /// </summary>
        /// <param name="id">El identificador único del colaborador a buscar.</param>
        /// <returns>
        /// Una respuesta HTTP que contiene el resultado de la operación:
        /// - 200: Si se encuentra el colaborador, devuelve sus datos.
        /// </returns>
        [HttpGet("Buscar/{id}")]
        public IActionResult Buscar(int id)
        {
            var response = _colaboradorPorSucursalService.Buscar(id);
            return Ok(response.Data);
        }
    }
}
