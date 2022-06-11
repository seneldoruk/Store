using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Store.Data;
using Store.DTO;
using Store.Entities;
using Store.Services;

namespace Store.Controllers;

public class AccountController : StoreController
{
    private readonly StoreContext _context;
    private readonly JWTService _jwtService;
    private readonly UserManager<User> _userManager;

    public AccountController(UserManager<User> userManager, JWTService jwtService, StoreContext context)
    {
        _userManager = userManager;
        _jwtService = jwtService;
        _context = context;
    }

    [HttpPost("login")]
    public async Task<ActionResult<JWTDTO>> Login(LoginDTO login)
    {
        var user = await _userManager.FindByNameAsync(login.Username);
        if (user == null || !await _userManager.CheckPasswordAsync(user, login.Password)) return Unauthorized();

        var basket = await RetrieveBasket(login.Username);
        var anonbasket = await RetrieveBasket(Request.Cookies["buyerId"]);

        if (anonbasket != null)
        {
            if (basket != null) _context.Baskets.Remove(basket);
            anonbasket.BuyerId = login.Username;
            Response.Cookies.Delete("buyerId");
            await _context.SaveChangesAsync();
        }

        return new JWTDTO
        {
            Email = user.Email,
            Token = await _jwtService.GenerateToken(user),
            Basket = anonbasket != null ? anonbasket.BasketToDTO() : basket?.BasketToDTO()
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
        var basket = await RetrieveBasket(user.UserName);
        return new JWTDTO
        {
            Email = user.Email,
            Token = await _jwtService.GenerateToken(user),
            Basket = basket.BasketToDTO()
        };
    }

    private async Task<Basket> RetrieveBasket(string buyerId)
    {
        if (string.IsNullOrWhiteSpace(buyerId))
        {
            Response.Cookies.Delete("buyerId");
            return null;
        }

        var basket = await _context.Baskets
            .Include(basket => basket.Items)
            .ThenInclude(item => item.Product)
            .FirstOrDefaultAsync(basket => basket.BuyerId == buyerId);
        return basket;
    }
}