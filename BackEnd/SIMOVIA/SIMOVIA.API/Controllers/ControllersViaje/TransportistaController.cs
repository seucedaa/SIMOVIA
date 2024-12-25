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
    public class TransportistaController : Controller
    {
        private readonly TransportistaService _transportistaService;
        private readonly IMapper _mapper;

        /// <summary>
        /// Constructor del controlador de transportista que inicializa el servicio y el mapeador.
        /// </summary>
        /// <param name="transportistaService">Instancia del servicio de transportistas.</param>
        /// <param name="mapper">Instancia del mapeador para conversiones de modelos.</param>
        public TransportistaController(TransportistaService transportistaService, IMapper mapper)
        {
            _transportistaService = transportistaService;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene una lista de todos los transportistas.
        /// </summary>
        /// <returns>Lista de transportistas disponibles.</returns>
        [HttpGet("Listar")]
        public IActionResult Listar()
        {
            var response = _transportistaService.Listar();
            return Ok(response.Data);
        }
    }
}
