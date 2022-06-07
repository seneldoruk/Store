using System.Collections.Generic;
using System.Linq;
using Store.Entities;

namespace Store.Extensions;

public static class ProductExtensions
{
    public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
    {
        if (string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(product => product.Name);
        query = orderBy switch
        {
            "price" => query.OrderBy(product => product.Price),
            "priceDesc" => query.OrderByDescending(product => product.Price),
            _ => query.OrderBy(product => product.Name)
        };
        return query;
    }

    public static IQueryable<Product> Search(this IQueryable<Product> query, string search)
    {
        if (string.IsNullOrWhiteSpace(search)) return query;

        search = search.Trim().ToLower();
        return query.Where(product => product.Name.ToLower().Contains(search));
    }

    public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
    {
        var brandList = new List<string>();
        var typeList = new List<string>();

        if (!string.IsNullOrWhiteSpace(brands)) brandList = brands.ToLower().Split(",").ToList();
        if (!string.IsNullOrWhiteSpace(types)) typeList = types.ToLower().Split(",").ToList();

        query = query.Where(product => brandList.Count == 0 || brandList.Contains(product.Brand.ToLower()));
        query = query.Where(product => typeList.Count == 0 || typeList.Contains(product.Type.ToLower()));

        return query;
    }
}