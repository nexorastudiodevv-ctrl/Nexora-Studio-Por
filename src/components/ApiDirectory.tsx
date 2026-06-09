import React, { useState } from "react";
import { FREE_APIS } from "../data";
import { ApiItem, AppLanguage } from "../types";
import {
  Search,
  Check,
  Copy,
  Terminal,
  Activity,
  ArrowRight,
  ExternalLink,
  CodeXml,
  Database,
  CloudSun,
  Camera,
  Bot,
  Gamepad
} from "lucide-react";
import { motion } from "motion/react";

interface ApiDirectoryProps {
  lang: AppLanguage;
}

export default function ApiDirectory({ lang }: ApiDirectoryProps) {
  const isAr = lang === "ar";
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeLangTab, setActiveLangTab] = useState<Record<string, "javascript" | "python" | "curl">>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [liveTestResults, setLiveTestResults] = useState<Record<string, { loading: boolean; data: any; error: any }>>({});

  const categories = [
    { id: "all", labelEn: "All APIs", labelAr: "كل الخدمات" },
    { id: "ai", labelEn: "AI & Learning", labelAr: "الذكاء الاصطناعي" },
    { id: "weather", labelEn: "Weather", labelAr: "الطقس" },
    { id: "data", labelEn: "Data & News", labelAr: "البيانات والأخبار" },
    { id: "images", labelEn: "Images & Media", labelAr: "الصور والوسائط" },
    { id: "gaming", labelEn: "Gaming & Fun", labelAr: "الألعاب والتسلية" },
  ];

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLiveTest = async (api: ApiItem) => {
    // If it's a mock or requires actual keys, direct them to write mock keys
    let endpoint = api.sampleEndpoint;
    if (api.id === "unsplash" || api.id === "tmdb" || api.id === "coingecko" || api.id === "gemini") {
      // Prompt that they need to register or use our sandbox key generator for mock testing
      setLiveTestResults(prev => ({
        ...prev,
        [api.id]: {
          loading: false,
          data: null,
          error: isAr
            ? "هذه الخدمة تتطلب مفتاح API حقيقي. يمكنك تسجيل حساب مجاني بالضغط على زر 'التسجيل للحصول على مفتاح' في الأعلى، أو تجربة مفتاح وهمي في شاشة المختبر المجاورة!"
            : "This service requires an actual API key. You can sign up for a free key using the 'Sign Up for Key' button above, or test generating a mock key in the REST Sandbox panel!"
        }
      }));
      return;
    }

    setLiveTestResults(prev => ({
      ...prev,
      [api.id]: { loading: true, data: null, error: null }
    }));

    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
      const data = await res.json();
      setLiveTestResults(prev => ({
        ...prev,
        [api.id]: { loading: false, data: data, error: null }
      }));
    } catch (err: any) {
      setLiveTestResults(prev => ({
        ...prev,
        [api.id]: { loading: false, data: null, error: err.message || "Failed to deliver request" }
      }));
    }
  };

  const filteredApis = FREE_APIS.filter(api => {
    const matchesCategory = activeCategory === "all" || api.category === activeCategory;
    const nameStr = isAr ? api.nameAr : api.nameEn;
    const descStr = isAr ? api.descriptionAr : api.descriptionEn;
    const matchesSearch = nameStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          descStr.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "ai": return <Bot className="w-5 h-5 text-purple-500" />;
      case "weather": return <CloudSun className="w-5 h-5 text-blue-500" />;
      case "data": return <Database className="w-5 h-5 text-emerald-500" />;
      case "images": return <Camera className="w-5 h-5 text-indigo-500" />;
      case "gaming": return <Gamepad className="w-5 h-5 text-pink-500" />;
      default: return <CodeXml className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
          <input
            id="api-search-input"
            type="text"
            placeholder={isAr ? "ابحث عن واجهات برمجة التطبيقات المجانية..." : "Search free APIs..."}
            className={`w-full ${isAr ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories toggler */}
        <div className={`flex flex-wrap gap-2 ${isAr ? 'justify-start' : 'justify-start'}`}>
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  isSelected
                    ? "bg-slate-900 dark:bg-emerald-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700/80"
                }`}
              >
                {isAr ? cat.labelAr : cat.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredApis.map((api) => {
          const currentTab = activeLangTab[api.id] || "javascript";
          const codeToDisplay = api.codeSnippets[currentTab];
          const testState = liveTestResults[api.id];

          return (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              key={api.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-700/50 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        {getCategoryIcon(api.category)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-50 text-base">
                          {isAr ? api.nameAr : api.nameEn}
                        </h3>
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 mt-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                          {isAr ? api.category.toUpperCase() : api.category.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <a
                      href={api.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2' text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
                      title={isAr ? "زيارة الموقع" : "Visit Website"}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>

                  <p className={`text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed ${isAr ? 'text-right' : 'text-left'}`}>
                    {isAr ? api.descriptionAr : api.descriptionEn}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/50 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <div className={`space-y-1 ${isAr ? 'text-right' : 'text-left'}`}>
                    <span className="block text-slate-400 dark:text-slate-500">{isAr ? "الترخيص / التوثيق:" : "Authentication:"}</span>
                    <span className="block text-slate-700 dark:text-slate-200 font-semibold">{isAr ? api.authTypeAr : api.authTypeEn}</span>
                  </div>
                  <div className={`space-y-1 ${isAr ? 'text-right' : 'text-left'}`}>
                    <span className="block text-slate-400 dark:text-slate-500">{isAr ? "الحد اليومي المسموح:" : "Daily Limits:"}</span>
                    <span className="block text-slate-700 dark:text-slate-200 font-semibold">{isAr ? api.limitAr : api.limitEn}</span>
                  </div>
                </div>
              </div>

              {/* Code Snippets & Try Live */}
              <div className="p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3 text-xs font-semibold">
                  {/* Language Buttons */}
                  <div className="flex gap-1.5">
                    {["javascript", "python", "curl"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveLangTab(prev => ({ ...prev, [api.id]: tab as any }))}
                        className={`px-2.5 py-1 rounded-md capitalize cursor-pointer font-mono text-[10px] transition-all ${
                          currentTab === tab
                            ? "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                            : "text-slate-400 dark:text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {tab === "javascript" ? "JS" : tab === "python" ? "Python" : "cURL"}
                      </button>
                    ))}
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={() => handleCopyCode(api.id, codeToDisplay)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-[11px] cursor-pointer"
                  >
                    {copiedId === api.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">{isAr ? "تم النسخ!" : "Copied!"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isAr ? "نسخ الكود" : "Copy Code"}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code display */}
                <div className="relative mb-3 bg-slate-950 rounded-xl p-3 border border-slate-800 dark:border-slate-900 overflow-x-auto">
                  <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed text-left whitespace-pre">
                    <code>{codeToDisplay}</code>
                  </pre>
                </div>

                {/* Live Sandbox Execution */}
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <a
                      href={api.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                    >
                      <span>{isAr ? "التسجيل للحصول على مفتاح مجاني" : "Sign up for Free API Key"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => handleLiveTest(api)}
                      disabled={testState?.loading}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Activity className={`w-3.5 h-3.5 ${testState?.loading ? 'animate-spin' : ''}`} />
                      <span>{testState?.loading ? (isAr ? "جاري الإرسال..." : "Testing...") : (isAr ? "تجربة الطلب حياً" : "Dry Run Live")}</span>
                    </button>
                  </div>

                  {/* Output Display */}
                  {testState && (testState.data || testState.error) && (
                    <div className="mt-3 p-3 rounded-lg border text-xs max-h-56 overflow-y-auto font-mono text-left bg-slate-900 border-slate-800">
                      {testState.error ? (
                        <p className="text-rose-400 break-words leading-relaxed whitespace-pre-wrap">{testState.error}</p>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-slate-500">// Status: 200 OK</span>
                          <pre className="text-emerald-300 xl:text-[11px] text-[10px] break-all whitespace-pre-wrap">
                            {JSON.stringify(testState.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredApis.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              {isAr ? "لا توجد نتائج تطابق بحثك الحالي." : "No free APIs match your current search constraints."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
