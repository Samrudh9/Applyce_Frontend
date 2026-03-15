/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend API base URL (e.g. https://skillfit.onrender.com).
   *  Required in production; omit for local dev (Vite proxy handles routing). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
