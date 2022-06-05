using System.Collections.Generic;

namespace Store.DTO;

public class BasketDTO
{
    public string BuyerId { get; set; }
    public List<BasketItemDTO> items { get; set; }
}