using SmartShoppingList.DTOs;

namespace SmartShoppingList.Services;

public interface ILlmService
{
    /// <summary>
    /// Given a plain-text item name, asks the LLM to estimate its current
    /// market price (AUD), assign a category, suggest an MUI icon name, and
    /// briefly explain the price estimate.
    /// </summary>
    Task<LlmPriceResult?> EstimatePriceAsync(string itemName);
}
