using System;
using Microsoft.AspNetCore.Mvc;

namespace Store.Controllers;

public class ErrorController : StoreController
{
    [HttpGet("not-found")]
    public ActionResult GetNotFound()
    {
        return NotFound();
    }

    [HttpGet("bad-request")]
    public ActionResult GetBadRequest()
    {
        return BadRequest(new ProblemDetails { Title = "Bad request" });
    }

    [HttpGet("validation-error")]
    public ActionResult GetValidationError()
    {
        ModelState.AddModelError("Problem 1", "First error");
        ModelState.AddModelError("Problem 2", "Secon error");
        return ValidationProblem();
    }

    [HttpGet("server-error")]
    public ActionResult GetServerError()
    {
        throw new Exception("Server error");
    }

    [HttpGet("unauthorized")]
    public ActionResult GetUnauthorized()
    {
        return Unauthorized();
    }
}