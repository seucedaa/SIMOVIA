using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SIMOVIA.BusinessLogic.Services.ServicesGeneral;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SIMOVIA.API.Controllers.ControllersGeneral
{
    [Route("api/[controller]")]
    [ApiController]
    public class CargoController : Controller
    {
        private readonly CargoService _cargoService;
        private readonly IMapper _mapper;

        /// <summary>
        /// Constructor del controlador de cargo que inicializa el servicio y el mapeador.
        /// </summary>
        /// <param name="cargoService">Instancia del servicio de cargos.</param>
        /// <param name="mapper">Instancia del mapeador para conversiones de modelos.</param>
        public CargoController(CargoService cargoService, IMapper mapper)
        {
            _cargoService = cargoService;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene una lista de todos los cargos.
        /// </summary>
        /// <returns>Lista de cargos disponibles.</returns>
        [HttpGet("Listar")]
        public IActionResult Listar()
        {
            var response = _cargoService.Listar();
            return Ok(response.Data);
        }
    }
}
