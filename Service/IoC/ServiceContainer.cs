using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.DependencyInjection;
using OrsaDemoWebApp.Models.Interface;

namespace OrsaDemoWebApp.Service.IoC
{
    public static class ServiceContainer
    {

        public static void AddScopedService(this IServiceCollection services)
        {

            services.AddScoped<IPersonnelsService, PersonnelsService>();
            services.AddScoped<IListPersonnelsService, ListPersonnelsService>();
            services.AddScoped<IUpdatePersonnelService, UpdatePersonnelService>();
            services.AddScoped<IGeograpyService, GetLocationService>();

        }

    }
}
