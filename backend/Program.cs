using Microsoft.EntityFrameworkCore;
using SmartShoppingList.Data;
using SmartShoppingList.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Services ────────────────────────────────────────────────────────────────

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database — SQLite (swap connection string for Azure SQL in production)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=shopping.db"));

// LLM Service
builder.Services.AddHttpClient<ILlmService, AnthropicLlmService>();

// CORS — allow the Vite dev server and any deployed frontend origin
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:4173",
                "https://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ── App ─────────────────────────────────────────────────────────────────────

var app = builder.Build();

// Auto-create / migrate the database on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("FrontendPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run();
