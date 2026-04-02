// ==========================
// GLOBAL WINDOW CONFIG TYPE
// ==========================

export {};

declare global {
  interface Window {
    CONFIG: {
      API_BASE_URL: string;
    };
  }
}

