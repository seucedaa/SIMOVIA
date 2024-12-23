using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SIMOVIA.BusinessLogic.Services.ServicesAcceso;
using SIMOVIA.BusinessLogic.Services.ServicesGeneral;
using SIMOVIA.BusinessLogic.Services.ServicesViaje;
using SIMOVIA.DataAccess.Repositories.RepositoriesAcceso;
using SIMOVIA.DataAccess.Repositories.RepositoriesGeneral;
using SIMOVIA.DataAccess.Repositories.RepositoriesViaje;

namespace SIMOVIA.BusinessLogic
{
    public static class ServiceConfiguration
    {
        public static void DataAcces(this IServiceCollection service, string connection)
        {
            SIMOVIA.DataAccess.SIMOVIA.BuildConnectionString(connection);

            #region Acceso
            service.AddScoped<UsuarioRepository>();
            #endregion 
            
            #region General
            service.AddScoped<ColaboradorRepository>();
            service.AddScoped<CargoRepository>();
            service.AddScoped<DepartamentoRepository>();
            service.AddScoped<MunicipioRepository>();
            service.AddScoped<EstadoCivilRepository>();
            #endregion
        }
        public static void BusinessLogic(this IServiceCollection service)
        {
            #region Acceso
            service.AddScoped<UsuarioService>();
            #endregion
            
            #region General
            service.AddScoped<ColaboradorService>();
            service.AddScoped<CargoService>();
            service.AddScoped<DepartamentoService>();
            service.AddScoped<MunicipioService>();
            service.AddScoped<EstadoCivilService>();
            #endregion
        }
    }
}
