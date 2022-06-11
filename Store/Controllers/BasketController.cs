using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Store.Data;
using Store.DTO;
using Store.Entities;

namespace Store.Controllers;

public class BasketController : StoreController
{
    private readonly StoreContext _context;

    public BasketController(StoreContext context)
    {
        _context = context;
    }

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDTO>> GetBasket()
    {
        var basket = await RetrieveBasket(GetBuyerId());
        if (basket == null) return NotFound();
        return basket.BasketToDTO();
    }


    [HttpPost]
    public async Task<ActionResult> AddBasketItem(int productid, int quantity)
    {
        var basket = await RetrieveBasket(GetBuyerId()) ?? CreateBasket();
        var product = await _context.Products.FindAsync(productid);
        if (product == null) return NotFound();
        basket.AddItem(product, quantity);
        var result = await _context.SaveChangesAsync() > 0;
        if (result) return CreatedAtRoute("GetBasket", basket.BasketToDTO());
        return BadRequest(new ProblemDetails { Title = "Cant save item to basket" });
    }


    [HttpDelete]
    public async Task<ActionResult> DeleteBasketItem(int productid, int quantity)
    {
        var basket = await RetrieveBasket(GetBuyerId());
        var product = await _context.Products.FindAsync(productid);
        if (basket == null || product == null) return NotFound();

        basket.RemoveItem(product, quantity);
        var result = await _context.SaveChangesAsync() > 0;
        if (result) return StatusCode(201);
        return BadRequest(new ProblemDetails { Title = "Cant delete item from basket" });
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

    private string GetBuyerId()
    {
        return User.Identity?.Name ?? Request.Cookies["buyerId"];
    }

    private Basket CreateBasket()
    {
        var buyerId = User.Identity?.Name;
        if (string.IsNullOrWhiteSpace(buyerId))
        {
            buyerId = Guid.NewGuid().ToString();
            var options = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append("buyerId", buyerId, options);
        }

        var basket = new Basket { BuyerId = buyerId };
        _context.Baskets.Add(basket);
        return basket;
    }
}