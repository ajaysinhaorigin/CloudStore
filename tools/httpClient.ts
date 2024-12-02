import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { apiUrls } from "./apiUrls";

type Body = object | string | number;

export function createHttpClient(
  accessToken?: string,
  params?: AxiosRequestConfig
) {
  // Create an Axios instance
  const httpClient: AxiosInstance = axios.create({
    baseURL: apiUrls.baseUrl,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    ...params,
  });

  // Request interceptor
  httpClient.interceptors.request.use(
    (config) => {
      // Add authorization or other headers if needed
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  httpClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (!error.isAxiosError) {
        return error;
      }

      const { data } = error.response || ({} as any);
      const message = data?.message;
      const errors = data?.errors || "";
      let errorMessage = Array.isArray(message) ? message.join(",") : message;

      if (Object(data).hasOwnProperty("errors")) {
        if (errors) {
          errorMessage = Object.keys(errors).length
            ? Object.keys(errors)
                .map((key) => `${key}: ${errors[key]}`)
                .join(", ")
            : "";
        }
      }

      return Promise.resolve({
        hasError: true,
        error: true,
        title: data?.title,
        statusCode: data?.status,
        statusText: data?.title || data?.messages?.[0],
      });
    }
  );

  // Define HTTP methods
  const get = (url: string, options?: any): Promise<any> =>
    httpClient.get(url, options);
  const post = <T = any>(url: string, body: Body, options?: any): Promise<T> =>
    httpClient.post(url, body, options);
  const put = <T = any>(url: string, body: Body, options?: any): Promise<T> =>
    httpClient.put(url, body, options);
  const del = <T = any>(url: string, body?: Body): Promise<T> =>
    httpClient.delete(url, { data: body });

  // Return the public API of the client
  return { get, post, put, delete: del };
}
