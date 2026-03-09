using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartShoppingList.Data;
using SmartShoppingList.DTOs;
using SmartShoppingList.Models;
using SmartShoppingList.Services;

namespace SmartShoppingList.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController(AppDbContext db, ILlmService llm, ILogger<ItemsController> logger)
    : ControllerBase
{
    // GET /api/items
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ItemResponse>>> GetAll()
    {
        var items = await db.Items
            .OrderByDescending(i => i.CreatedAt)
            .Select(i => ToResponse(i))
            .ToListAsync();

        return Ok(items);
    }

    // GET /api/items/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ItemResponse>> GetById(int id)
    {
        var item = await db.Items.FindAsync(id);
        return item is null ? NotFound() : Ok(ToResponse(item));
    }

    // POST /api/items
    [HttpPost]
    public async Task<ActionResult<ItemResponse>> Create([FromBody] CreateItemRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("Item name cannot be empty.");

        var item = new ShoppingItem { Name = request.Name.Trim() };

        // Call the LLM — failure is non-fatal; the item is saved without price data
        var llmResult = await llm.EstimatePriceAsync(item.Name);
        if (llmResult is not null)
        {
            item.EstimatedPrice = llmResult.Price;
            item.Category = llmResult.Category;
            item.IconName = llmResult.IconName;
            item.PriceReasoning = llmResult.Reasoning;
        }
        else
        {
            logger.LogWarning("LLM returned no result for item '{Name}'", item.Name);
        }

        db.Items.Add(item);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = item.Id }, ToResponse(item));
    }

    // DELETE /api/items/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await db.Items.FindAsync(id);
        if (item is null) return NotFound();

        db.Items.Remove(item);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private static ItemResponse ToResponse(ShoppingItem i) => new(
        i.Id,
        i.Name,
        i.EstimatedPrice,
        i.Category,
        i.IconName,
        i.PriceReasoning,
        i.CreatedAt
    );
}
