using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Store.Middleware;

public class ExceptionMiddleware
{
    private readonly IHostEnvironment _environment;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 500;
            var res = new ProblemDetails
            {
                Status = 500,
                Detail = _environment.IsDevelopment() ? e.StackTrace : null,
                Title = e.Message
            };
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(res, options);
            await context.Response.WriteAsync(json);
        }
    }
}