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
    public class DepartamentoController : Controller
    {
        private readonly DepartamentoService _departamentoService;
        private readonly IMapper _mapper;

        /// <summary>
        /// Constructor del controlador de departamento que inicializa el servicio y el mapeador.
        /// </summary>
        /// <param name="departamentoService">Instancia del servicio de departamentos.</param>
        /// <param name="mapper">Instancia del mapeador para conversiones de modelos.</param>
        public DepartamentoController(DepartamentoService departamentoService, IMapper mapper)
        {
            _departamentoService = departamentoService;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene una lista de todos los departamentos.
        /// </summary>
        /// <returns>Lista de departamentos disponibles.</returns>
        [HttpGet("Listar")]
        public IActionResult Listar()
        {
            var response = _departamentoService.Listar();
            return Ok(response.Data);
        }
    }
}
