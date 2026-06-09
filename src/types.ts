export interface ApiItem {
  id: string;
  nameEn: string;
  nameAr: string;
  category: "all" | "ai" | "weather" | "gaming" | "data" | "images";
  descriptionEn: string;
  descriptionAr: string;
  authTypeEn: string;
  authTypeAr: string;
  limitEn: string;
  limitAr: string;
  url: string;
  signupUrl: string;
  documentationUrl: string;
  sampleEndpoint: string;
  codeSnippets: {
    javascript: string;
    python: string;
    curl: string;
  };
}

export interface GeneratedKey {
  key: string;
  plan: string;
  createdAt: string;
  limits: string;
}

export interface MockRequestLog {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  status: number;
  response: any;
}

export type AppLanguage = "ar" | "en";
