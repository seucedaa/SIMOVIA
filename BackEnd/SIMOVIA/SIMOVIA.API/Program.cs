using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SIMOVIA.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.ConfigureKestrel(serverOptions =>
                    {
                        // Establece el timeout en 2 minutos para el servidor
                        serverOptions.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(2);
                        serverOptions.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(2);
                    })
                    .UseStartup<Startup>();
                });
    }
}
