namespace SmartShoppingList.Models;

public class ShoppingItem
{
    public int Id { get; set; }

    /// <summary>Raw text the user typed, e.g. "Gaming Laptop"</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>AI-estimated market price in AUD</summary>
    public decimal? EstimatedPrice { get; set; }

    /// <summary>AI-assigned category, e.g. "Electronics"</summary>
    public string? Category { get; set; }

    /// <summary>Material UI icon name for the category</summary>
    public string? IconName { get; set; }

    /// <summary>Short reasoning returned by the LLM</summary>
    public string? PriceReasoning { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
