using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Store.Data;
using Store.Entities;
using Store.Extensions;
using Store.RequestHelpers;

namespace Store.Controllers;

public class ProductsController : StoreController
{
    private readonly StoreContext _context;

    public ProductsController(StoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
    {
        var query = _context.Products
            .Sort(productParams.OrderBy)
            .Search(productParams.Search)
            .Filter(productParams.Brands, productParams.Types)
            .AsQueryable();
        var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);
        Response.AddPaginationHeader(products.MetaData);
        return products;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters()
    {
        var brands = await _context.Products.Select(product => product.Brand).Distinct().ToListAsync();
        var types = await _context.Products.Select(product => product.Type).Distinct().ToListAsync();
        return Ok(new { brands, types });
    }
}