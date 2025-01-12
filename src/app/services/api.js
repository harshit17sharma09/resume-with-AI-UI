import axios from "axios";

// Base Axios instance
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000", // FastAPI backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept requests to add the Authorization header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login API
export const login = async (data) => {
  const response = await apiClient.post("/login", data);
  return response.data;
};

// Upload Resume API
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/upload-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Request Access API
export const requestAccess = async () => {
  const response = await apiClient.post("/request-access");
  return response.data;
};

// Check Access API
export const checkAccess = async () => {
  const response = await apiClient.get("/check-access");
  return response.data;
};

// Chat API
export const chatWithResume = async (query, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("query", query);

  const response = await apiClient.post("/chat", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
