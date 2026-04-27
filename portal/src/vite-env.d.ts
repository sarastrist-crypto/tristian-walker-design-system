/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_BOOKFUNNEL_URL: string;
  readonly VITE_HERO_PITCH: string;
  readonly VITE_HERO_VIDEO_PATH: string;
  readonly VITE_HERO_POSTER_PATH: string;
  readonly VITE_TEASER_VIDEO_PATH: string;
  readonly VITE_TEASER_POSTER_PATH: string;
  readonly VITE_CAMPAIGN_END_DATE: string;
  readonly VITE_TARGET_AUDIENCE: "default" | "recovery" | "communities" | "teams";
  readonly VITE_RESPONSE_QUESTION: string;
  readonly VITE_API_BASE: string;
  readonly VITE_TURNSTILE_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.md?raw" {
  const content: string;
  export default content;
}
