// =====================================================
// lib/api.ts (FINAL CLEAN VERSION - window.CONFIG)
// =====================================================

import axios from "axios";

// =====================================================
// STEP 1: AXIOS INSTANCE
// =====================================================
const apiClient = axios.create({
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// STEP 2: BASE URL FROM window.CONFIG
// =====================================================
const getBaseURL = () => {
  return window.CONFIG?.API_BASE_URL || "http://cafecloude-001-site1.stempurl.com/api";
};

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================
apiClient.interceptors.request.use((config) => {
  // ✅ Set base URL
  config.baseURL = getBaseURL();

  // ✅ Attach token
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ Debug log
  const qs = config.params
    ? "?" + new URLSearchParams(config.params as any).toString()
    : "";

  console.log("🚀 API CALL:", config.baseURL + config.url + qs);

  return config;
});

// =====================================================
// STEP 3: STATUS → USER MESSAGE
// =====================================================
function getUserFriendlyMessage(status?: number): string {
  switch (status) {
    case 400:
      return "Invalid request. Please check details.";
    case 401:
      return "Session expired. Please login again.";
    case 403:
      return "You do not have permission.";
    case 404:
      return "Service not found.";
    case 408:
      return "Request timeout. Try again.";
    case 500:
      return "Server error. Try later.";
    case 503:
      return "Service unavailable.";
    default:
      return "Something went wrong.";
  }
}

// =====================================================
// STEP 4: GLOBAL ERROR HANDLER
// =====================================================
function handleApiError(error: any) {
  console.error("❌ API ERROR:", error);

  // ⏱ Timeout
  if (error.code === "ECONNABORTED") {
    return {
      data: {
        msgId: -1,
        Msg: "Server is taking too long to respond.",
        Data: null,
      },
    };
  }

  // 🌐 Network error
  if (!error.response) {
    return {
      data: {
        msgId: -1,
        Msg: "No internet connection.",
        Data: null,
      },
    };
  }

  const status = error.response.status;

  // 🔐 Auto logout
  if (status === 401) {
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }, 1000);
  }

  return {
    data: {
      msgId: -1,
      Msg: getUserFriendlyMessage(status),
      Data: null,
    },
  };
}

// =====================================================
// STEP 5: API METHODS
// =====================================================
export const api = {
  // GET
  async get(url: string, config?: any) {
    try {
      const res = await apiClient.get(url, config);
      return res;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // POST (JSON)
  async post(url: string, data?: any, config?: any) {
    try {
      const res = await apiClient.post(url, data, config);
      return res;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // DELETE
  async delete(url: string, config?: any) {
    try {
      const res = await apiClient.delete(url, config);
      return res;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // POST FORM DATA
  async postForm(url: string, formData: FormData, config?: any) {
    try {
      const res = await apiClient.post(url, formData, {
        ...config,
        headers: {
          ...(config?.headers || {}),
          "Content-Type": "multipart/form-data",
        },
      });

      return res;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default api;

