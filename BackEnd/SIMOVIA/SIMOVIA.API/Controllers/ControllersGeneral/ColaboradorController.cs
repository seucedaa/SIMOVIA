﻿using AutoMapper;
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
    public class ColaboradorController : Controller
    {
        private readonly ColaboradorService _colaboradorService;
        private readonly IMapper _mapper;
        /// <summary>
        /// Constructor del controlador de colaborador que inicializa el servicio y el mapeador.
        /// </summary>
        /// <param name="estadocivilService">Instancia del servicio de colaboradores.</param>
        /// <param name="mapper">Instancia del mapeador para conversiones de modelos.</param>
        public ColaboradorController(ColaboradorService colaboradorService, IMapper mapper)
        {
            _colaboradorService = colaboradorService;
            _mapper = mapper;
        }


        /// <summary>
        /// Obtiene una lista de todos los colaboradores.
        /// </summary>
        /// <returns>Lista de colaboradores disponibles.</returns>
        [HttpGet("Listar")]
        public IActionResult Listar()
        {
            var response = _colaboradorService.Listar();
            return Ok(response.Data);
        }

        /// <summary>
        /// Inserta un nuevo colaborador en la base de datos.
        /// </summary>
        /// <param name="rolViewModel">El objeto ColaboradorViewModel que contiene los datos del colaborador a insertar.</param>
        /// <returns>
        /// Una respuesta HTTP que contiene el resultado de la operación:
        /// - 200: Si la inserción fue exitosa, devuelve el ID del colaborador.
        /// - 409: Si el DNI o el correo electrónico ya existen.
        /// - 500: Si ocurrió un error inesperado durante la operación.
        /// </returns>
        [HttpPost("Insertar")]
        public virtual IActionResult Create(ColaboradorViewModel rolViewModel)
        {
            var modelo = _mapper.Map<ColaboradorViewModel, tbColaboradores>(rolViewModel);
            var response = _colaboradorService.Insertar(modelo);
            return Ok(response);
        }

        /// <summary>
        /// Busca y obtiene los datos de un colaborador específico por su ID.
        /// </summary>
        /// <param name="id">El identificador único del colaborador a buscar.</param>
        /// <returns>
        /// Una respuesta HTTP que contiene el resultado de la operación:
        /// - 200: Si se encuentra el colaborador, devuelve sus datos.
        /// - 500: Si ocurre un error inesperado durante la operación.
        /// </returns>
        [HttpGet("Buscar/{id}")]
        public IActionResult Buscar(int id)
        {
            var response = _colaboradorService.Buscar(id);
            return Ok(response.Data);
        }
    }
}