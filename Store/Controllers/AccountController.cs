using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Store.DTO;
using Store.Entities;
using Store.Services;

namespace Store.Controllers;

public class AccountController : StoreController
{
    private readonly JWTService _jwtService;
    private readonly UserManager<User> _userManager;

    public AccountController(UserManager<User> userManager, JWTService jwtService)
    {
        _userManager = userManager;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<JWTDTO>> Login(LoginDTO login)
    {
        var user = await _userManager.FindByNameAsync(login.Username);
        if (user == null || !await _userManager.CheckPasswordAsync(user, login.Password)) return Unauthorized();
        return new JWTDTO
        {
            Email = user.Email,
            Token = await _jwtService.GenerateToken(user)
        };
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDTO dto)
    {
        var user = new User
        {
            UserName = dto.Username,
            Email = dto.Email
        };
        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors) ModelState.AddModelError(error.Code, error.Description);

            return ValidationProblem();
        }

        await _userManager.AddToRoleAsync(user, "Member");
        return StatusCode(201);
    }

    [Authorize]
    [HttpGet("currentUser")]
    public async Task<ActionResult<JWTDTO>> GetCurrentUser()
    {
        var user = await _userManager.FindByNameAsync(User.Identity.Name);
        return new JWTDTO
        {
            Email = user.Email,
            Token = await _jwtService.GenerateToken(user)
        };
    }
}