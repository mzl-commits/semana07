import axios from "axios";

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api", timeout: 30000 });
let accessToken = null;
let refreshHandler = null;
let pendingRefresh = null;
export const setAccessToken = (token) => { accessToken = token; };
export const setRefreshHandler = (handler) => { refreshHandler = handler; };
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
api.interceptors.response.use((response) => response, async (error) => {
  const request = error.config;
  const authRequest = /\/auth\/(signin|signup|refreshtoken|signout)(?:\?|$)/.test(request?.url || "");
  if (error.response?.status === 401 && request && !request._retry && !authRequest && refreshHandler) {
    request._retry = true;
    // Comparte una renovacion para las solicitudes que vencen a la vez.
    pendingRefresh ||= refreshHandler().finally(() => { pendingRefresh = null; });
    const token = await pendingRefresh;
    request.headers.Authorization = `Bearer ${token}`;
    return api(request);
  }
  return Promise.reject(error);
});
