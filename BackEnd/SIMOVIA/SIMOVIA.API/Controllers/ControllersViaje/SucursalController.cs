using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SIMOVIA.BusinessLogic.Services.ServicesViaje;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SIMOVIA.API.Controllers.ControllersViaje
{
    [Route("api/[controller]")]
    [ApiController]
    public class SucursalController : Controller
    {
        private readonly SucursalService _sucursalService;
        private readonly IMapper _mapper;

        /// <summary>
        /// Constructor del controlador de sucursal que inicializa el servicio y el mapeador.
        /// </summary>
        /// <param name="sucursalService">Instancia del servicio de sucursales.</param>
        /// <param name="mapper">Instancia del mapeador para conversiones de modelos.</param>
        public SucursalController(SucursalService sucursalService, IMapper mapper)
        {
            _sucursalService = sucursalService;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene una lista de todos los sucursales.
        /// </summary>
        /// <returns>Lista de sucursales disponibles.</returns>
        [HttpGet("Listar")]
        public IActionResult Listar()
        {
            var response = _sucursalService.Listar();
            return Ok(response.Data);
        }
    }
}
