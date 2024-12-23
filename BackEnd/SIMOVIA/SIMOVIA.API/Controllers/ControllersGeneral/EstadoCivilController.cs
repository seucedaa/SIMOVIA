using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SIMOVIA.BusinessLogic.Services.ServicesGeneral;
using SIMOVIA.Common.Models.ModelsGeneral;
using SIMOVIA.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SIMOVIA.API.Controllers.ControllersGeneral
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstadoCivilController : Controller
    {
        private readonly EstadoCivilService _estadocivilService;
        private readonly IMapper _mapper;
        /// <summary>
        /// Constructor del controlador de estado civil que inicializa el servicio y el mapeador.
        /// </summary>
        /// <param name="estadocivilService">Instancia del servicio de estados civiles.</param>
        /// <param name="mapper">Instancia del mapeador para conversiones de modelos.</param>
        public EstadoCivilController(EstadoCivilService estadocivilService, IMapper mapper)
        {
            _estadocivilService = estadocivilService;
            _mapper = mapper;
        }


        /// <summary>
        /// Obtiene una lista de todos los estados civiles.
        /// </summary>
        /// <returns>Lista de estados civiles disponibles.</returns>
        [HttpGet("Listar")]
        public IActionResult Listar()
        {
            var response = _estadocivilService.Listar();
            return Ok(response.Data);
        }
    }
}
