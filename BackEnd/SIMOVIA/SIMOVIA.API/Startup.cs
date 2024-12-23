
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;
using System.IO;

using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using SIMOVIA.API.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using SIMOVIA.BusinessLogic;

namespace SIMOVIA.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.AllowAnyOrigin()
                                      .AllowAnyHeader()
                                      .AllowAnyMethod());
            });

            services.DataAcces(Configuration.GetConnectionString("ConexionSIMOVIA"));
            services.BusinessLogic();
            services.AddAutoMapper(x => x.AddProfile<MappingProfileExtensions>(), AppDomain.CurrentDomain.GetAssemblies());
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "SIMOVIA.API", Version = "v1" });
            });


            services.AddHttpContextAccessor();


            services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
                {
                    Description = "ApiKey must appear in header",
                    Type = SecuritySchemeType.ApiKey,
                    Name = "XApiKey",
                    In = ParameterLocation.Header,
                    Scheme = "ApiKeyScheme"
                });
                var key = new OpenApiSecurityScheme()
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "ApiKey"
                    },
                    In = ParameterLocation.Header
                };
                var requirement = new OpenApiSecurityRequirement
                    {
                             { key, new List<string>() }
                    };
                options.AddSecurityRequirement(requirement);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                //app.UseSwagger();
                //app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SIMOVIA.API v1"));
            }

            app.UseCors("AllowSpecificOrigin");
            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseAuthorization();

            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SIMOVIA.API v1"));

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
