// <copyright file="Startup.cs" company="Engage Squared">
// Copyright (c) Engage Squared. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.DLLookup
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Identity.Client;
    using PoliceIncidents.Authentication;
    using PoliceIncidents.Core.DB;
    using PoliceIncidents.Helpers;
    using PoliceIncidents.Models;
    using PoliceIncidents.Tab;
    using PoliceIncidents.Tab.Interfaces;
    using PoliceIncidents.Tab.Services;
    using System.Net.Http;

    /// <summary>
    /// Default Startup class.
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Startup"/> class.
        /// </summary>
        /// <param name="configuration">Instance of application configuration properties.</param>
        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;
        }

        /// <summary>
        /// Gets application configuration value.
        /// </summary>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services">IServiceCollection instance.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            var scopes = this.Configuration["AzureAd:GraphScope"].Split(new char[] { ' ' }, System.StringSplitOptions.RemoveEmptyEntries);
            IConfidentialClientApplication confidentialClientApp = ConfidentialClientApplicationBuilder.Create(this.Configuration["AzureAd:ClientId"])
                .WithClientSecret(this.Configuration["AzureAd:ClientSecret"]).WithTenantId(this.Configuration["AzureAd:TenantId"])
                .Build();

            services.AddMemoryCache();
            services.AddSingleton(new HttpClient());
            services.AddSingleton<AppSettings>();
            services.AddDistributedMemoryCache();
            services.AddSingleton<IConfidentialClientApplication>(confidentialClientApp);
            services.AddDLLookupAuthentication(this.Configuration);
            services.AddSingleton<TokenAcquisitionHelper>();
            services.AddSession();

            this.ConfigureDataServices(services);
            services.AddApplicationInsightsTelemetry(this.Configuration["ApplicationInsights:InstrumentationKey"]);

            services.Configure<CacheOptions>(options =>
            {
                options.CacheInterval = this.Configuration.GetValue<int>("CacheInterval");
            });

            services.Configure<AzureAdOptions>(options =>
            {
                options.ClientId = this.Configuration.GetValue<string>("AzureAd:ClientId");
                options.ClientSecret = this.Configuration.GetValue<string>("AzureAd:ClientSecret");
                options.GraphScope = this.Configuration.GetValue<string>("AzureAd:GraphScope");
                options.TenantId = this.Configuration.GetValue<string>("AzureAd:TenantId");
            });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddHttpClient();
        }

        private void ConfigureDataServices(IServiceCollection services)
        {
            string connectionString = this.Configuration.GetConnectionString("PoliceIncidents");

            if (string.IsNullOrEmpty(connectionString))
            {
                services.AddScoped<IIncidentService, FakeIncidentService>();
                services.AddScoped<IIncidentUpdateService, FakeIncidentUpdateService>();
            }
            else
            {
                services.AddDbContext<PoliceIncidentsDbContext>(p => { p.UseSqlServer(connectionString); });
                services.AddScoped<IIncidentService, IncidentService>();
                services.AddScoped<IIncidentUpdateService, IncidentUpdateService>();
            }
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseSession();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseRouting();

            // app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
