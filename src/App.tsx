import React, { useState, useEffect } from "react";
import { AppLanguage, GeneratedKey, MockRequestLog } from "./types";
import { FREE_APIS } from "./data";
import LanguageToggle from "./components/LanguageToggle";
import ApiDirectory from "./components/ApiDirectory";
import {
  Key,
  KeyRound,
  Compass,
  CodeXml,
  Send,
  RefreshCw,
  Cpu,
  Bookmark,
  Sparkles,
  Layers,
  HelpCircle,
  CheckCircle2,
  Lock,
  Moon,
  Sun,
  Bot,
  ArrowRight,
  Info
} from "lucide-react";

export default function App() {
  const [lang, setLang] = useState<AppLanguage>("ar");
  const [activeTab, setActiveTab] = useState<"directory" | "sandbox" | "gemini-guide">("directory");
  
  // REST Sandbox State
  const [generatedKey, setGeneratedKey] = useState<GeneratedKey | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("weather");
  const [customParams, setCustomParams] = useState<string>("location=Riyadh");
  const [requestLogs, setRequestLogs] = useState<MockRequestLog[]>([]);
  const [isSendingRequest, setIsSendingRequest] = useState<boolean>(false);
  const [sandboxApiKey, setSandboxApiKey] = useState<string>("");

  // Gemini AI Sandbox State
  const [geminiPrompt, setGeminiPrompt] = useState<string>("");
  const [geminiResponse, setGeminiResponse] = useState<string>("");
  const [isGeneratingGemini, setIsGeneratingGemini] = useState<boolean>(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);

  const isAr = lang === "ar";

  // Auto-generate deep mock key if not exists on load to make experience instant
  useEffect(() => {
    handleGenerateMockKey();
  }, []);

  const handleGenerateMockKey = async () => {
    try {
      const response = await fetch("/api/mock/keygen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "Starter Free" }),
      });
      const data = await response.json();
      setGeneratedKey(data);
      setSandboxApiKey(data.key);
      
      // Seed a pleasant introductory log
      const introLog: MockRequestLog = {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        method: "POST",
        url: "/api/mock/keygen",
        status: 200,
        response: data
      };
      setRequestLogs([introLog]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendSandboxRequest = async () => {
    setIsSendingRequest(true);
    const keyToUse = sandboxApiKey || (generatedKey ? generatedKey.key : "");
    const startTime = Date.now();
    const endpoint = `/api/mock/data?category=${selectedCategory}&${customParams}`;

    const newLog: Partial<MockRequestLog> = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString(),
      method: "GET",
      url: endpoint,
    };

    try {
      const response = await fetch(endpoint, {
        headers: {
          "x-api-key": keyToUse,
          "Content-Type": "application/json"
        }
      });
      
      const resData = await response.json();
      
      setRequestLogs(prev => [
        {
          ...newLog,
          status: response.status,
          response: resData
        } as MockRequestLog,
        ...prev
      ]);
    } catch (error: any) {
      setRequestLogs(prev => [
        {
          ...newLog,
          status: 500,
          response: { error: error.message || "Network request failed" }
        } as MockRequestLog,
        ...prev
      ]);
    } finally {
      setIsSendingRequest(false);
    }
  };

  const handleTestGemini = async () => {
    if (!geminiPrompt.trim()) return;
    setIsGeneratingGemini(true);
    setGeminiError(null);
    setGeminiResponse("");

    try {
      const response = await fetch("/api/gemini/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: geminiPrompt,
          systemInstruction: "You are a concise AI developer assistant inside an educational API guide directory."
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        setGeminiError(data.error || "Failed to contact proxy handler.");
      } else {
        setGeminiResponse(data.text);
      }
    } catch (error: any) {
      setGeminiError(error.message || "Failed to contact Backend server.");
    } finally {
      setIsGeneratingGemini(false);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-emerald-500/20">
      
      {/* Top Banner & Language Selector */}
      <header id="app-header" className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-xs">
              <KeyRound className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                {isAr ? "دليل ومختبر API المجاني" : "Free API Directory & Hub"}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isAr ? "بوابتك للحصول على مفاتيح برمجة تطبيقات مجانية 100%" : "Your ultimate playground & directory for free API keys"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle currentLanguage={lang} onLanguageChange={setLang} />
          </div>
        </div>
      </header>

      {/* Hero Header Section */}
      <section id="hero-section" className="relative py-12 md:py-16 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            {isAr ? "تحديث مستمر للعام 2026" : "Updated live for 2026"}
          </span>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
            {isAr ? (
              <>
                كيف تحصل على مفاتيح <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">API مجانية للذكاء</span> الاصطناعي وباقي الخدمات؟
              </>
            ) : (
              <>
                How to unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">100% Free API Keys</span> for your next web application?
              </>
            )}
          </h2>

          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "العديد من الخدمات الرائعة توفر خططًا مجانية بالكامل دون الحاجة لإدخال بطاقتك الائتمانية. لقد جمعنا لك دليلًا للخدمات المجانية ووفرنا لك بالإضافة إلى ذلك بيئة اختبارية لتوليد مفاتيح تجريبية ومحاكاة عمليات البرمجة مباشرة!"
              : "Many magnificent services provide generous free plans with zero-credit-card required. We have consolidated this directory, complete with codes, plus built an interactive workspace sandbox to test REST calls with mock keys on the fly!"}
          </p>

          {/* Core App Tab Toggles */}
          <div className="flex items-center justify-center p-1 bg-slate-100 dark:bg-slate-950/80 rounded-2xl max-w-md mx-auto border border-slate-200/60 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("directory")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "directory"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{isAr ? "دليل واجهات البرمجة" : "API Directory"}</span>
            </button>
            <button
              onClick={() => setActiveTab("sandbox")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "sandbox"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
              }`}
            >
              <CodeXml className="w-4 h-4" />
              <span>{isAr ? "مختبر مبرمج الـ API" : "REST Sandbox"}</span>
            </button>
            <button
              onClick={() => setActiveTab("gemini-guide")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "gemini-guide"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-500" />
              <span>{isAr ? "واجهة Gemini مجاناً" : "Gemini AI Free Key"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-12">
        {activeTab === "directory" && (
          <div className="space-y-6">
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${isAr ? 'text-right' : 'text-left'}`}>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isAr ? "تصفح واجهات البرمجة المجانية والرموز البرمجية" : "Popular Free API Indexes"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isAr ? "خدمات حقيقية تماماً ومباشرة يمكنك توظيفها مجاناً في مشاريعك الشخصية" : "Actual live standard services that provide fair usage free allocations with easy signups"}
                </p>
              </div>
            </div>

            <ApiDirectory lang={lang} />
          </div>
        )}

        {/* REST Sandbox Section */}
        {activeTab === "sandbox" && (
          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className={`space-y-2 ${isAr ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center gap-2 text-emerald-500 font-bold">
                  <Key className="w-5 h-5" />
                  <span>{isAr ? "مُولد المفاتيح التجريبية الفوري" : "Instant Sandbox API Token Generator"}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isAr ? "احصل على مفتاح API وهمي مفعّل فوراً" : "Generate a Simulative Hub Key in 1 Second"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                  {isAr
                    ? "يقوم هذا النظام بمحاكاة السيرفرات الحقيقية لمساعدتك في بناء المشاريع وتجربة إرسال واستلام البيانات من الـ REST API في متصفحك."
                    : "This environment generates mock tokens and runs real database endpoints to simulate actual live parameters on your client."}
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleGenerateMockKey}
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer w-full text-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
                  <span>{isAr ? "توليد مفتاح جديد مجاناً" : "Generate Free Key"}</span>
                </button>
                {generatedKey && (
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {isAr ? "✅ مفتاحك مفعّل وصالح للاستخدام!" : "✅ Key active and authorized!"}
                  </span>
                )}
              </div>
            </div>

            {generatedKey && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Simulated Panel Controls */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className={`font-bold text-slate-900 dark:text-white flex items-center gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                      <Info className="w-4 h-4 text-slate-400" />
                      <span>{isAr ? "لوحة التحكم بالطلب التجريبي" : "Dry Run Endpoint Customizer"}</span>
                    </h3>

                    {/* Authorized Key display box */}
                    <div className="space-y-1.5">
                      <label className={`block text-xs font-semibold text-slate-500 dark:text-slate-400 ${isAr ? 'text-right' : 'text-left'}`}>
                        {isAr ? "مفتاح الـ API المستخدم (في الـ Header):" : "API Token Header (x-api-key):"}
                      </label>
                      <input
                        type="text"
                        className="w-full font-mono text-xs p-3 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                        value={sandboxApiKey}
                        onChange={(e) => setSandboxApiKey(e.target.value)}
                        placeholder="apikey_free_hub_..."
                      />
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-1.5">
                      <label className={`block text-xs font-semibold text-slate-500 dark:text-slate-400 ${isAr ? 'text-right' : 'text-left'}`}>
                        {isAr ? "اختر تصنيف البيانات للطلب:" : "Choose Dataset Domain:"}
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={`w-full text-xs p-3 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:ring-emerald-500 focus:outline-none ${isAr ? 'text-right' : ''}`}
                      >
                        <option value="weather">{isAr ? "الطقس وحالة الجو (Weather)" : "Weather & Forecasts"}</option>
                        <option value="news">{isAr ? "الأخبار العالمية والعلمية (News & Research)" : "Global News & Feeds"}</option>
                        <option value="finance">{isAr ? "أسعار العملات المشفرة (Fintech Index)" : "Exchange Rates"}</option>
                        <option value="quotes">{isAr ? "حكم وأقوال عربية وعالمية (Quotes & Lore)" : "Arabic & English Quotes"}</option>
                      </select>
                    </div>

                    {/* Params Config */}
                    <div className="space-y-1.5">
                      <label className={`block text-xs font-semibold text-slate-500 dark:text-slate-400 ${isAr ? 'text-right' : 'text-left'}`}>
                        {isAr ? "الروابط و الباراميترز المخصصة (?string):" : "Custom Query String Parameters (?):"}
                      </label>
                      <input
                        type="text"
                        className="w-full font-mono text-xs p-3 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                        value={customParams}
                        onChange={(e) => setCustomParams(e.target.value)}
                        placeholder="location=Riyadh&format=json"
                      />
                    </div>

                    {/* Endpoint URL Preview string */}
                    <div className="space-y-1">
                      <span className="block text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {isAr ? "معاينة رابط الطلب النهائي:" : "Endpoint Destination Preview:"}
                      </span>
                      <div className="p-2 border border-slate-100 dark:border-slate-800 rounded-lg text-[11px] font-mono text-emerald-600 bg-slate-50 dark:bg-slate-950/40 break-all text-left">
                        GET {window.location.origin}/api/mock/data?category={selectedCategory}&{customParams}
                      </div>
                    </div>

                    <button
                      onClick={handleSendSandboxRequest}
                      disabled={isSendingRequest}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSendingRequest ? (isAr ? "جاري الإرسال للتجربة..." : "Calling Endpoints...") : (isAr ? "أرسل طلب الـ API" : "Send API Request")}</span>
                    </button>
                  </div>
                </div>

                {/* HTTP Request & Response Log viewer */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 text-slate-100 p-6 flex flex-col justify-between min-h-[420px] shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                          {isAr ? "مراقب طلبات الـ API الحي" : "REST API Live Request Monitor"}
                        </span>
                        <button
                          onClick={() => setRequestLogs([])}
                          className="text-[10px] text-slate-400 hover:text-slate-100 transition-colors bg-slate-900 border border-slate-800 px-2 py-1 rounded cursor-pointer"
                        >
                          {isAr ? "مسح السجل" : "Clear Shell"}
                        </button>
                      </div>

                      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                        {requestLogs.map((log) => (
                          <div key={log.id} className="border-b border-slate-900 pb-3 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${log.method === "GET" ? "bg-emerald-500/10 text-emerald-400" : "bg-purple-500/10 text-purple-400"}`}>
                                  {log.method}
                                </span>
                                <span className="text-slate-400 max-w-[200px] truncate">{log.url}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-slate-500">{log.timestamp}</span>
                                <span className={`font-bold ${log.status === 200 ? "text-emerald-400" : "text-rose-400"}`}>
                                  {log.status} {log.status === 200 ? "OK" : "ERROR"}
                                </span>
                              </div>
                            </div>
                            <pre className="p-3 bg-slate-900/60 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-900">
                              <code>{JSON.stringify(log.response, null, 2)}</code>
                            </pre>
                          </div>
                        ))}

                        {requestLogs.length === 0 && (
                          <div className="py-20 text-center text-slate-500 font-mono text-xs">
                            {isAr ? "// في انتظار تفعيل وطلب أول رابط..." : "// Ready. Configure parameters and call send request above."}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-3 text-right">
                      {isAr ? "يمكنك استخدام هذا المفتاح في مشاريعك التجريبية المحلية أيضاً!" : "All payloads simulate real API JSON standard structures perfectly."}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gemini Tutorial and Playground Tab */}
        {activeTab === "gemini-guide" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Guide to get the actual free API key */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                <div className={`space-y-2 ${isAr ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 justify-start">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <span>{isAr ? "دليل الحصول على مفتاح Gemini مجاناً" : "Step Guide: Get your Real Gemini API Key"}</span>
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isAr
                      ? "توفر شركة Google من خلال استوديو الذكاء الاصطناعي (Google AI Studio) مفتاحاً مجانياً ومذهلاً يتيح لك ما يصل إلى 1,500 طلب يومياً لمعالجة النصوص وربط النماذج الذكية بموقعك أو تطبيقك مجاناً وبسهولة مطلقة!"
                      : "Google offers a truly stellar generous free tier inside Google AI Studio, giving you up to 1,500 daily requests for Gemini models completely free! This is how you unlock and use it:"}
                  </p>
                </div>

                {/* Steps illustration */}
                <div className="space-y-4 font-normal">
                  <div className={`flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-50 text-sm">
                        {isAr ? "انتقل إلى Google AI Studio" : "Go to Google AI Studio"}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isAr ? "افتح الموقع الرسمي:" : "Open the official platform link:"}{" "}
                        <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5">
                          aistudio.google.com <ArrowRight className="w-3 h-3" />
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-50 text-sm">
                        {isAr ? "انقر على زر Get API Key" : "Click on 'Get API Key'"}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isAr ? "ستجد الزر الأزرق الواضح في أعلى الشاشة الجانبية. اضغط عليه ثم اختر Create API Key." : "You'll locate the prominent blue button on the top-left sidebar. Click it, then click 'Create API Key' in a new project."}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-50 text-sm">
                        {isAr ? "انسخ المفتاح واحفظه بأمان" : "Copy Your Token Safely"}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isAr ? "انسخ المفتاح الذي يبدأ بـ 'AIzaSy' واحفظه في ملف البيئة الخاص بك .env كمتغير بإسم GEMINI_API_KEY." : "Copy the token string beginning with 'AIzaSy' and save it securely in your local project .env file under GEMINI_API_KEY."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 text-xs leading-relaxed flex items-start gap-3">
                  <Info className="w-5 h-5 shrink-0" />
                  <p>
                    {isAr
                      ? "تنصيحة هامة: لا تقم بمشاركة مفتاح الـ API الخاص بك في الكود الأمامي للعميل المتصفح لتجنب كشفه وسرقته، بل قم بوضعه دائماً داخل سيرفر خلفي (Backend) وهو ما نمثله نحن حالياً في هذا التطبيق."
                      : "Security Tip: Always invoke your API keys from a backend route proxy to shield it from browser extraction."}
                  </p>
                </div>
              </div>
            </div>

            {/* Live testing emulator */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className={`space-y-1 ${isAr ? 'text-right' : 'text-left'}`}>
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                    <Cpu className="w-4 h-4" />
                    {isAr ? "محرر ومختبر ذكاء اصطناعي حي" : "Live Proxy AI Playground"}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {isAr ? "جرّب نماذج Gemini حياً هنا" : "Test Gemini Responses"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isAr
                      ? "جرب إرسال التعليمات والأسئلة لنموذج ذكاء اصطناعي تفاعلي حقيقي."
                      : "Type a detailed prompt down to run inference using server-side Gemini 3.5-flash."}
                  </p>
                </div>

                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={geminiPrompt}
                    onChange={(e) => setGeminiPrompt(e.target.value)}
                    placeholder={
                      isAr
                        ? "اكتب هنا سؤالاً أو فكرة، كـ: 'ما هي أهم 5 واجهات برمجة تطبيقات للمبتدئين؟'..."
                        : "Type your query here, e.g. 'What is the fastest way to format a JSON object?'"
                    }
                    className={`w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-950 placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/35 focus:border-emerald-500 ${isAr ? 'text-right' : 'text-left'}`}
                  />

                  <button
                    onClick={handleTestGemini}
                    disabled={isGeneratingGemini || !geminiPrompt.trim()}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingGemini ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingGemini ? (isAr ? "جاري التوليد من الذكاء الاصطناعي..." : "Prompting Model...") : (isAr ? "شغّل طلب الذكاء الاصطناعي" : "Generate AI Answer")}</span>
                  </button>
                </div>

                {/* Response panel */}
                {(geminiResponse || geminiError) && (
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-sans text-xs space-y-2">
                    {geminiError ? (
                      <div className="text-rose-500 space-y-2 text-left leading-relaxed">
                        <div className="font-bold flex items-center gap-1.5">
                          <Lock className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>تطلب مفتاح حقيقي / Missing API Credentials</span>
                        </div>
                        <p className="text-[11px] whitespace-pre-line text-slate-700 dark:text-slate-300">
                          {geminiError}
                        </p>
                      </div>
                    ) : (
                      <div className={`space-y-1.5 ${isAr ? 'text-right' : 'text-left'}`}>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {isAr ? "الرد المستلم:" : "Generated Text Content:"}
                        </span>
                        <div className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                          {geminiResponse}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Section holding human labels and guidelines */}
      <footer id="app-footer" className="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/60 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-normal">
          <p>
            &copy; 2026 {isAr ? "شبكة مفاتيح الـ API المفتوحة للجميع" : "Free API Key Playground & Hub Inc."}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{isAr ? "الخوادم مستقرة وسريعة" : "Platform Live & Active"}</span>
            </span>
            <span>|</span>
            <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">
              {isAr ? "مستندات الذكاء الاصطناعي" : "Google AI Docs"}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
