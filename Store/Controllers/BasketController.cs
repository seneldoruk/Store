using System;
using System.Linq;
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
        var basket = await RetrieveBasket();
        if (basket == null) return NotFound();
        return BasketToDTO(basket);
    }


    [HttpPost]
    public async Task<ActionResult> AddBasketItem(int productid, int quantity)
    {
        var basket = await RetrieveBasket() ?? CreateBasket();
        var product = await _context.Products.FindAsync(productid);
        if (product == null) return NotFound();
        basket.AddItem(product, quantity);
        var result = await _context.SaveChangesAsync() > 0;
        if (result) return CreatedAtRoute("GetBasket", BasketToDTO(basket));
        return BadRequest(new ProblemDetails { Title = "Cant save item to basket" });
    }


    [HttpDelete]
    public async Task<ActionResult> DeleteBasketItem(int productid, int quantity)
    {
        var basket = await RetrieveBasket();
        var product = await _context.Products.FindAsync(productid);
        if (basket == null || product == null) return NotFound();

        basket.RemoveItem(product, quantity);
        var result = await _context.SaveChangesAsync() > 0;
        if (result) return StatusCode(201);
        return BadRequest(new ProblemDetails { Title = "Cant delete item from basket" });
    }

    private async Task<Basket> RetrieveBasket()
    {
        var basket = await _context.Baskets
            .Include(basket => basket.Items)
            .ThenInclude(item => item.Product)
            .FirstOrDefaultAsync(basket => basket.BuyerId == Request.Cookies["buyerId"]);
        return basket;
    }

    private Basket CreateBasket()
    {
        var buyerId = Guid.NewGuid().ToString();
        var options = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
        Response.Cookies.Append("buyerId", buyerId, options);
        var basket = new Basket { BuyerId = buyerId };
        _context.Baskets.Add(basket);
        return basket;
    }

    private static BasketDTO BasketToDTO(Basket basket)
    {
        return new BasketDTO
        {
            BuyerId = basket.BuyerId,
            items = basket.Items.Select(item => new BasketItemDTO
            {
                ProductId = item.ProductId,
                Name = item.Product.Name,
                Price = item.Product.Price,
                PictureUrl = item.Product.PictureUrl,
                Type = item.Product.Type,
                Brand = item.Product.Brand,
                Quantity = item.Quantity
            }).ToList()
        };
    }
}