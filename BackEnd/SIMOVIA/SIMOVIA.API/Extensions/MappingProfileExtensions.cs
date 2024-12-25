using AutoMapper;
using SIMOVIA.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SIMOVIA.Entities;
using SIMOVIA.Common.Models.ModelsAcceso;
using SIMOVIA.Common.Models.ModelsGeneral;
using SIMOVIA.Common.Models.ModelsViaje;

namespace SIMOVIA.API.Extensions
{
    public class MappingProfileExtensions : Profile
    {
        public MappingProfileExtensions()
        {
            #region Acceso
            CreateMap<UsuarioViewModel, tbUsuarios>().ReverseMap();
            #endregion
            
            #region General
            CreateMap<ColaboradorViewModel, tbColaboradores>().ReverseMap();
            #endregion

            #region Viaje
            CreateMap<ColaboradorPorSucursalViewModel, tbColaboradoresPorSucursal>().ReverseMap();
            CreateMap<ViajeEncabezadoViewModel, tbViajesEncabezado>().ReverseMap();
            CreateMap<ViajeDetalleViewModel, tbViajesDetalle>().ReverseMap();
            #endregion
        }

    }
}
