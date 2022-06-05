using System.Collections.Generic;
using System.Linq;

namespace Store.Entities;

public class Basket
{
    public int Id { get; set; }
    public string BuyerId { get; set; }
    public List<BasketItem> Items { get; set; } = new();

    public void AddItem(Product product, int quant)
    {
        if (Items.All(item => item.ProductId != product.Id))
            Items.Add(new BasketItem { Product = product, Quantity = quant });

        var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
        if (existingItem != null) existingItem.Quantity += quant;
    }

    public void RemoveItem(Product product, int quant)
    {
        var item = Items.FirstOrDefault(item => item.ProductId == product.Id);
        if (item == null) return;
        item.Quantity -= quant;
        if (item.Quantity < 1) Items.Remove(item);
    }
}