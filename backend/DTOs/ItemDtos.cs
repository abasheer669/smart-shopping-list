namespace SmartShoppingList.DTOs;

/// <summary>Payload sent by the frontend to create an item.</summary>
public record CreateItemRequest(string Name);

/// <summary>Response returned to the frontend after creation or retrieval.</summary>
public record ItemResponse(
    int Id,
    string Name,
    decimal? EstimatedPrice,
    string? Category,
    string? IconName,
    string? PriceReasoning,
    DateTime CreatedAt
);

/// <summary>Structured data we ask the LLM to return.</summary>
public record LlmPriceResult(
    decimal Price,
    string Category,
    string IconName,
    string Reasoning
);
