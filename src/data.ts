import { ApiItem } from "./types";

export const FREE_APIS: ApiItem[] = [
  {
    id: "gemini",
    nameEn: "Google Gemini API",
    nameAr: "واجهة برمجة تطبيقات Google Gemini",
    category: "ai",
    descriptionEn: "Access Google's latest next-generation AI models (Gemini 2.5/3.5) for text generation, translation, processing, and multi-modal analysis.",
    descriptionAr: "الوصول إلى أحدث نماذج الذكاء الاصطناعي من Google لإنشاء النصوص والترجمة ومعالجة البيانات وتحليل الوسائط المتعددة.",
    authTypeEn: "Free API Key (via Google AI Studio)",
    authTypeAr: "مفتاح API مجاني (عبر Google AI Studio)",
    limitEn: "15 Requests per Minute (1,500/day for flash tiers)",
    limitAr: "15 طلب في الدقيقة (1,500 يومياً للنسخة السريعة)",
    url: "https://aistudio.google.com/",
    signupUrl: "https://aistudio.google.com/",
    documentationUrl: "https://ai.google.dev/gemini-api/docs",
    sampleEndpoint: "/api/gemini/playground (Backend Simulated)",
    codeSnippets: {
      javascript: `import { GoogleGenAI } from "@google/genai";\nconst ai = new GoogleGenAI({ apiKey: "YOUR_FREE_GEMINI_KEY" });\n\nconst response = await ai.models.generateContent({\n  model: "gemini-3.5-flash",\n  contents: "Explain Quantum Physics to a child",\n});\nconsole.log(response.text);`,
      python: `from google import genai\nclient = genai.Client(api_key="YOUR_FREE_GEMINI_KEY")\n\nresponse = client.models.generate_content(\n    model='gemini-3.5-flash',\n    contents='Explain Quantum Physics to a child',\n)\nprint(response.text)`,
      curl: `curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=YOUR_FREE_GEMINI_KEY" \\\n-H "Content-Type: application/json" \\\n-d '{"contents": [{"parts":[{"text": "Explain Quantum Physics to a child"}]}]}'`
    }
  },
  {
    id: "open-meteo",
    nameEn: "Open-Meteo Weather API",
    nameAr: "طقس أوبن ميتيو",
    category: "weather",
    descriptionEn: "Highly detailed and free weather forecast API offering worldwide locations. No API key is required whatsoever for research and demo usage.",
    descriptionAr: "واجهة برمجة تطبيقات مجانية بالكامل لبيانات وتوقعات الطقس الدقيقة في جميع أنحاء العالم. لا تتطلب أي مفتاح للاستخدام التجريبي.",
    authTypeEn: "No Auth Required (100% Free)",
    authTypeAr: "بدون توثيق (مجاني 100%)",
    limitEn: "Up to 10,000 daily requests per subscriber",
    limitAr: "حتى 10,000 طلب يومياً لكل مستخدم",
    url: "https://open-meteo.com/",
    signupUrl: "https://open-meteo.com/",
    documentationUrl: "https://open-meteo.com/en/docs",
    sampleEndpoint: "https://api.open-meteo.com/v1/forecast?latitude=24.71&longitude=46.67&current=temperature_2m",
    codeSnippets: {
      javascript: `// Weather in Riyadh\nfetch("https://api.open-meteo.com/v1/forecast?latitude=24.71&longitude=46.67&current=temperature_2m")\n  .then(res => res.json())\n  .then(data => console.log(\`Riyadh Temp: \${data.current.temperature_2m}°C\`));`,
      python: `import requests\nurl = "https://api.open-meteo.com/v1/forecast?latitude=24.71&longitude=46.67&current=temperature_2m"\nres = requests.get(url).json()\nprint(f"Riyadh Temp: {res['current']['temperature_2m']}C")`,
      curl: `curl "https://api.open-meteo.com/v1/forecast?latitude=24.71&longitude=46.67&current=temperature_2m"`
    }
  },
  {
    id: "jsonplaceholder",
    nameEn: "JSONPlaceholder",
    nameAr: "جي سون بلايس هولدر",
    category: "data",
    descriptionEn: "A phenomenal mock REST API service useful for testing applications, layout rendering, posts lists, and prototyping. No database needed.",
    descriptionAr: "خدمة REST API وهمية تتيح بيانات مسبقة التجهيز (منشورات، مستخدمين، مهام) رائعة لتجربة تصميم التطبيق ومحاكاة عمليات الإرسال.",
    authTypeEn: "No Auth Required (100% Open)",
    authTypeAr: "بدون توثيق (مفتوح بالكامل)",
    limitEn: "Unlimited requests, completely persistent support",
    limitAr: "طلبات غير محدودة، ومحاكاة مستمرة لعمليات الحفظ",
    url: "https://jsonplaceholder.typicode.com/",
    signupUrl: "https://jsonplaceholder.typicode.com/",
    documentationUrl: "https://jsonplaceholder.typicode.com/guide/",
    sampleEndpoint: "https://jsonplaceholder.typicode.com/posts/1",
    codeSnippets: {
      javascript: `fetch("https://jsonplaceholder.typicode.com/posts/1")\n  .then(res => res.json())\n  .then(post => console.log("Post Title:", post.title));`,
      python: `import requests\nres = requests.get("https://jsonplaceholder.typicode.com/posts/1").json()\nprint("Post Title:", res["title"])`,
      curl: `curl "https://jsonplaceholder.typicode.com/posts/1"`
    }
  },
  {
    id: "unsplash",
    nameEn: "Unsplash Image API",
    nameAr: "مخزن صور أنسبلاش",
    category: "images",
    descriptionEn: "Access millions of hand-curated, stunning, high-definition stock photos. Perfect for visual web apps, design cards, and mockups.",
    descriptionAr: "الوصول إلى ملايين الصور الجمالية عالية الدقة التي تم تصميمها واختيارها يدوياً بواسطة فوتوغرافيين فنانين.",
    authTypeEn: "Free API Key (Developer Application)",
    authTypeAr: "مفتاح API مجاني (حساب محصل المطورين)",
    limitEn: "50 requests per hour (Upgradable to 5,000/hr)",
    limitAr: "50 طلباً بالساعة (يمكن ترقيته لـ 5000 طلب مجاناً بمجرد تفعيل التطبيق)",
    url: "https://unsplash.com/developers",
    signupUrl: "https://unsplash.com/oauth/applications",
    documentationUrl: "https://unsplash.com/documentation",
    sampleEndpoint: "https://api.unsplash.com/photos/random?client_id=YOUR_ACCESS_KEY",
    codeSnippets: {
      javascript: `// Fetch a random high-quality nature image\nfetch("https://api.unsplash.com/photos/random?query=nature&client_id=YOUR_ACCESS_KEY")\n  .then(res => res.json())\n  .then(data => console.log("Image URL:", data.urls.regular));`,
      python: `import requests\nheaders = {"Authorization": "Client-ID YOUR_ACCESS_KEY"}\nres = requests.get("https://api.unsplash.com/photos/random?query=nature", headers=headers).json()\nprint("Image URL:", res["urls"]["regular"])`,
      curl: `curl "https://api.unsplash.com/photos/random?query=nature" \\\n-H "Authorization: Client-ID YOUR_ACCESS_KEY"`
    }
  },
  {
    id: "tmdb",
    nameEn: "The Movie Database (TMDB)",
    nameAr: "قاعدة بيانات الأفلام (TMDB)",
    category: "data",
    descriptionEn: "Highly detailed and rich metadata for movies, TV shows, actors, ratings, and artwork. Used by top streaming portals worldwide.",
    descriptionAr: "قاعدة بيانات الأفلام والمسلسلات والممثلين والتقييمات وصور البوسترات الشاملة والغنية، وهي الأكثر استخداماً عالمياً.",
    authTypeEn: "Free API Key (In Account Settings)",
    authTypeAr: "مفتاح API مجاني (من قسم إعدادات الحساب)",
    limitEn: "Unlimited requests (Fair use restrictions)",
    limitAr: "غير محدود من الطلبات (شريطة الاستخدام العادل)",
    url: "https://www.themoviedb.org/",
    signupUrl: "https://www.themoviedb.org/signup",
    documentationUrl: "https://developer.themoviedb.org/docs",
    sampleEndpoint: "https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY",
    codeSnippets: {
      javascript: `fetch("https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY")\n  .then(res => res.json())\n  .then(data => console.log("Trending Movie:", data.results[0].title));`,
      python: `import requests\nres = requests.get("https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY").json()\nprint("Trending Movie:", res["results"][0]["title"])`,
      curl: `curl "https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY"`
    }
  },
  {
    id: "coingecko",
    nameEn: "CoinGecko Crypto API",
    nameAr: "عملات كوين جيكو الرقمية",
    category: "data",
    descriptionEn: "Get real-time market data, price indexes, volume, trading stats, and trends for over 10,000+ cryptocurrencies directly.",
    descriptionAr: "احصل على أسعار تداول العملات المشفرة ومستويات العرض والطلب وبيانات السوق لأكثر من 10 آلاف عملة مشفرة بشكل فوري ومباشر.",
    authTypeEn: "Free API Key (Demo Plan)",
    authTypeAr: "مفتاح API مجاني (خطة العرض التجريبية)",
    limitEn: "30 Requests / Minute (10,000/month)",
    limitAr: "30 طلب في الدقيقة (حتى 10,000 طلب شهرياً مجاناً)",
    url: "https://www.coingecko.com/en/api",
    signupUrl: "https://www.coingecko.com/en/api/pricing",
    documentationUrl: "https://www.coingecko.com/en/api/documentation",
    sampleEndpoint: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
    codeSnippets: {
      javascript: `fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")\n  .then(res => res.json())\n  .then(data => console.log("Bitcoin Price:", data.bitcoin.usd, "USD"));`,
      python: `import requests\nres = requests.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd").json()\nprint("Bitcoin Price:", res["bitcoin"]["usd"], "USD")`,
      curl: `curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"`
    }
  },
  {
    id: "pokeapi",
    nameEn: "PokéAPI",
    nameAr: "بوكيمون API",
    category: "gaming",
    descriptionEn: "All the Pokémon data you will ever need in one place. Absolutely free, no auth, perfect for educational React homework.",
    descriptionAr: "جميع البيانات التي تحتاجها حول شخصيات البوكيمون في مكان واحد. مجاني بالكامل بدون تسجيل، وهو الأفضل للتعلم وبناء مشاريع تجريبية.",
    authTypeEn: "No Auth Required (100% Free)",
    authTypeAr: "بدون توثيق (مجاني 100%)",
    limitEn: "Up to 100 requests per IP per minute",
    limitAr: "حتى 100 طلب في الدقيقة لكل عنوان IP",
    url: "https://pokeapi.co/",
    signupUrl: "https://pokeapi.co/",
    documentationUrl: "https://pokeapi.co/docs/v2",
    sampleEndpoint: "https://pokeapi.co/api/v2/pokemon/ditto",
    codeSnippets: {
      javascript: `fetch("https://pokeapi.co/api/v2/pokemon/pikachu")\n  .then(res => res.json())\n  .then(data => console.log("Weight:", data.weight));`,
      python: `import requests\nres = requests.get("https://pokeapi.co/api/v2/pokemon/pikachu").json()\nprint("Weight:", res["weight"])`,
      curl: `curl "https://pokeapi.co/api/v2/pokemon/pikachu"`
    }
  },
  {
    id: "cat-facts",
    nameEn: "Cat Facts API",
    nameAr: "حقائق عن الحيوانات",
    category: "gaming",
    descriptionEn: "A public, lightweight API that gives you random, clean, entertaining facts about cats. Perfect for teaching JSON fetching.",
    descriptionAr: "واجهة برمجة تطبيقات خفيفة وبسيطة لإرجاع حقائق عشوائية ومسلية حول الحيوانات، مثالية لتعلم استيراد وقراءة مصفوفات JSON.",
    authTypeEn: "No Auth Required (100% Free)",
    authTypeAr: "بدون توثيق (مجاني 100%)",
    limitEn: "Unlimited requests, fast and keyless",
    limitAr: "غير محدود الطلبات، مستقر وبدون حسابات",
    url: "https://catfact.ninja/",
    signupUrl: "https://catfact.ninja/",
    documentationUrl: "https://catfact.ninja/",
    sampleEndpoint: "https://catfact.ninja/fact",
    codeSnippets: {
      javascript: `fetch("https://catfact.ninja/fact")\n  .then(res => res.json())\n  .then(data => console.log("Cat Fact:", data.fact));`,
      python: `import requests\nres = requests.get("https://catfact.ninja/fact").json()\nprint("Cat Fact:", res["fact"])`,
      curl: `curl "https://catfact.ninja/fact"`
    }
  }
];
