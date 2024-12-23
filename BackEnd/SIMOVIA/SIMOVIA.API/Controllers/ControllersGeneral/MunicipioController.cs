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
    public class MunicipioController : Controller
    {
        private readonly MunicipioService _municipioService;
        private readonly IMapper _mapper;
        public MunicipioController(MunicipioService municipioService, IMapper mapper)
        {
            _municipioService = municipioService;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene una lista de todos los municipios filtrados por el departamento seleccionado.
        /// </summary>
        /// <returns>Lista de municipios disponibles.</returns>
        [HttpGet("ListarPorDepartamento/{id}")]
        public IActionResult ListarPorDepartamento(int id)
        {
            var response = _municipioService.ListarPorDepartamento(id);
            return Ok(response.Data);
        }

    }

}
