using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SIMOVIA.BusinessLogic.Services.ServicesAcceso;
using AutoMapper;

namespace SIMOVIA.API.Controllers.ControllersAcceso
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : Controller
    {

        private readonly UsuarioService _usuarioService;
        private readonly IMapper _mapper;

        public UsuarioController(UsuarioService usuarioService, IMapper mapper)
        {
            _mapper = mapper;
            _usuarioService = usuarioService;
        }

        [HttpGet("InicioSesion/{usuario}/{clave}")]
        public IActionResult InicioSesion(string usuario, string clave)
        {
            var respuesta = _usuarioService.InicioSesion(usuario, clave);

            return Ok(respuesta.Data);
        }
    }
}
