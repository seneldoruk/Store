using System.Linq;
using Store.DTO;
using Store.Entities;

namespace Store.Controllers;

public static class BasketExtensions
{
    public static BasketDTO BasketToDTO(this Basket basket)
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