using Microsoft.AspNetCore.Http;
using Microsoft.Azure.KeyVault.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIMOVIA.API.Middleware
{
    public class ApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private const string APIKEY = "XApiKey";
        private const string ENCRYPTION = "EncryptionKey";
        private readonly IConfiguration _configuration;

        public ApiKeyMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var appSettings = context.RequestServices.GetRequiredService<IConfiguration>();
            var apiKey = appSettings.GetValue<string>(APIKEY);
            var password = appSettings.GetValue<string>(ENCRYPTION);
            var path = context.Request.Path.Value.ToLower();
            
            if (context.Request.Path == "/api/Usuarios/Login")
            {
                context.Response.OnStarting(async () =>
                {
                    if (context.Response.StatusCode == 200)
                    {
                        var encryptedKey = Encryption.Encrypt(apiKey, Encoding.ASCII.GetBytes(password));

                        context.Response.Headers.Add("Authorization", Convert.ToBase64String(encryptedKey));
                    }

                });

                await _next(context);
            }
            else
            {


                if (!context.Request.Headers.TryGetValue(APIKEY, out var extractedApiKey))
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Api Key was not provided ");
                    return;
                }

                try
                {

                    if (!apiKey.Equals(extractedApiKey))
                    {
                        context.Response.StatusCode = 401;
                        await context.Response.WriteAsync("Unauthorized client");
                        return;
                    }
                }
                catch (KeyVaultErrorException)
                {
                    context.Response.StatusCode = 500;
                    await context.Response.WriteAsync("Failed to retrieve API Key from Azure Key Vault");
                    return;
                }

                await _next(context);
            }

        }
    }


}
