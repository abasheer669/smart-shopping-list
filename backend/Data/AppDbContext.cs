using Microsoft.EntityFrameworkCore;
using SmartShoppingList.Models;

namespace SmartShoppingList.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<ShoppingItem> Items => Set<ShoppingItem>();
}
