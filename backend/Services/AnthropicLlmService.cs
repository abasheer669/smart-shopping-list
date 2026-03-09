using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using SmartShoppingList.DTOs;

namespace SmartShoppingList.Services;

public partial class AnthropicLlmService(HttpClient httpClient, IConfiguration config, ILogger<AnthropicLlmService> logger)
    : ILlmService
{
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    [GeneratedRegex(@"\{[\s\S]*\}", RegexOptions.None)]
    private static partial Regex JsonBlockRegex();

    public async Task<LlmPriceResult?> EstimatePriceAsync(string itemName)
    {
        var apiKey = config["Gemini:ApiKey"]
            ?? throw new InvalidOperationException("Gemini:ApiKey is not configured.");
        var model = config["Gemini:Model"] ?? "gemini-1.5-flash";

        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

        
        var prompt =
            $$"""
            You are a market-price oracle. Respond ONLY with a valid JSON object, no markdown, no explanation.

            JSON shape:
            {
              "price": <number — estimated current Australian market price in AUD>,
              "category": <one of: Electronics, Clothing, Food, Books, Home, Sports, Beauty, Toys, Automotive, Other>,
              "iconName": <a valid Material UI icon name e.g. "LaptopMac", "Checkroom", "LocalGroceryStore">,
              "reasoning": <one sentence explaining the price estimate>
            }

            Estimate the price of: {{itemName}}
            """;

        var requestBody = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = prompt } } }
            },
            generationConfig = new { temperature = 0.2, maxOutputTokens = 512 }
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, url);
        request.Content = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json"
        );

        HttpResponseMessage response;
        try { response = await httpClient.SendAsync(request); }
        catch (Exception ex) { logger.LogError(ex, "HTTP error calling Gemini API"); return null; }

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            logger.LogError("Gemini API error {Status}: {Body}", response.StatusCode, error);
            return null;
        }

        var responseJson = await response.Content.ReadAsStringAsync();

        string llmText;
        try
        {
            var doc = JsonNode.Parse(responseJson);
            llmText = doc?["candidates"]?[0]?["content"]?["parts"]?[0]?["text"]?.GetValue<string>() ?? string.Empty;
        }
        catch (Exception ex) { logger.LogError(ex, "Failed to parse Gemini response"); return null; }

        var match = JsonBlockRegex().Match(llmText);
        if (!match.Success) { logger.LogWarning("No JSON block in response: {Text}", llmText); return null; }

        try { return JsonSerializer.Deserialize<LlmPriceResult>(match.Value, JsonOpts); }
        catch (Exception ex) { logger.LogError(ex, "Failed to deserialise JSON: {Json}", match.Value); return null; }
    }
}