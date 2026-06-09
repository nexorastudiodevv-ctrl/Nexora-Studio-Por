import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialize Gemini API client or return null if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// 1. Gemini AI Playground Proxy to simulate free access
app.post("/api/gemini/playground", async (req, res) => {
  try {
    const { prompt, model = "gemini-3.5-flash", systemInstruction } = req.body;

    if (!prompt) {
       res.status(400).json({ error: "Missing prompt parameter" });
       return;
    }

    const ai = getGeminiClient();
    if (!ai) {
       res.status(503).json({
        error: "Gemini API key is not configured in this workspace.",
        setupGuide: "To enable the AI generator playground, add your GEMINI_API_KEY to the Google AI Studio secrets panel (Settings > Secrets).",
      });
      return;
    }

    const config: any = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: config,
    });

    res.json({
      success: true,
      text: response.text,
      modelUsed: model,
      rawResponse: response,
    });
  } catch (error: any) {
    console.error("Gemini proxy error:", error);
    res.status(500).json({
      error: error.message || "Failed to contact Gemini API",
    });
  }
});

// 2. Mock API Key registration / verification in-memory
const activeMockKeys = new Set<string>();

app.post("/api/mock/keygen", (req, res) => {
  const { plan = "Starter Free" } = req.body;
  const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const mockKey = `apikey_free_hub_${uniqueId}`;
  activeMockKeys.add(mockKey);
  res.json({
    key: mockKey,
    plan,
    createdAt: new Date().toISOString(),
    limits: "1,000 requests / day (Simulated)",
  });
});

// 3. Mock REST Endpoint acting as a backend for the API keys matching their queries
app.get("/api/mock/data", (req, res) => {
  // Validate headers
  const apiKeyHeader = req.headers["x-api-key"] || req.headers["authorization"];
  let providedKey = "";

  if (typeof apiKeyHeader === "string") {
    if (apiKeyHeader.startsWith("Bearer ")) {
      providedKey = apiKeyHeader.substring(7);
    } else {
      providedKey = apiKeyHeader;
    }
  }

  if (!providedKey) {
     res.status(401).json({
      error: "Unauthorized: Missing API Key.",
      message: "Please provide a valid API key in the 'X-API-Key' header or 'Authorization: Bearer <key>' header.",
    });
    return;
  }

  if (!activeMockKeys.has(providedKey) && !providedKey.startsWith("apikey_free_hub_")) {
     res.status(403).json({
      error: "Forbidden: Invalid API Key.",
      message: "The API key provided does not exist or has expired inside this sandbox.",
    });
    return;
  }

  const { category = "weather" } = req.query;

  // Mock response generation based on API category
  if (category === "weather") {
    res.json({
      status: "success",
      api: "WeatherMock-API v1",
      data: {
        location: req.query.location || "Riyadh, Saudi Arabia",
        temperature: `${20 + Math.floor(Math.random() * 25)}°C`,
        humidity: `${40 + Math.floor(Math.random() * 40)}%`,
        condition: ["Sunny", "Partly Cloudy", "Clear Sky", "Warm Breeze"][Math.floor(Math.random() * 4)],
        wind_speed: "18 km/h",
        forecast: [
          { day: "Tomorrow", temp: "34°C", condition: "Sunny" },
          { day: "Thursday", temp: "32°C", condition: "Sunny" },
          { day: "Friday", temp: "35°C", condition: "Warm and Sunny" },
        ],
      },
      headers_received: {
        "x-api-key": providedKey,
        "content-type": "application/json",
      },
    });
  } else if (category === "news") {
    res.json({
      status: "success",
      api: "NewsMock-API v1",
      total_results: 3,
      articles: [
        {
          title: "How to Build Full-Stack Apps in Google AI Studio",
          author: "Developer Advocate",
          publishedAt: new Date().toISOString(),
          summary: "Learn step-by-step how to unleash the power of server-side Gemini in standard React full-stack applications with port 3000.",
        },
        {
          title: "Top 10 Fully Free Public APIs for Developers",
          author: "Tech Explorer",
          publishedAt: new Date().toISOString(),
          summary: "A list of completely free APIs that require no credentials, ideal for building rich portfolios and personal dashboards.",
        },
        {
          title: "Global Weather Patterns Show Surprises This Season",
          author: "Meteorology Post",
          publishedAt: new Date().toISOString(),
          summary: "Fluctuations in temperatures point to unexpected cool evenings across regional plains.",
        },
      ],
      headers_received: {
        "x-api-key": providedKey,
      },
    });
  } else if (category === "finance") {
    res.json({
      status: "success",
      api: "FinMock-API v1",
      base_currency: "USD",
      rates: {
        SAR: 3.75,
        AED: 3.674,
        EGP: 47.90,
        EUR: 0.921,
        GBP: 0.784,
        JPY: 156.45,
      },
      timestamp: Date.now(),
      headers_received: {
        "x-api-key": providedKey,
      },
    });
  } else if (category === "quotes") {
     res.json({
       status: "success",
       api: "QuoteMock-API v1",
       quote: {
         text: "التعليم هو أقوى سلاح يمكنك استخدامه لتغيير العالم.",
         author: "Nelson Mandela",
         translation: "Education is the most powerful weapon which you can use to change the world.",
       },
       headers_received: {
         "x-api-key": providedKey,
       }
     });
  } else {
    res.json({
      status: "success",
      api: "SandboxMock-API v1",
      message: "Your key is valid! Use category=weather, category=news, category=finance, or category=quotes to get specific datasets.",
      headers_received: {
        "x-api-key": providedKey,
      },
    });
  }
});

// 4. Start Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
