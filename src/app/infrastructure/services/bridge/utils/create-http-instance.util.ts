import axios, { AxiosResponse } from "axios";
// Types and Interfaces
import type { AxiosRequestConfig, AxiosInstance } from "axios";
import { HttpInstanceInterface } from "src/app/infrastructure/services/interfaces";
// Exceptions
import {
  CanceledException,
  NetworkException,
  TimeoutException,
} from "@root/app/infrastructure/services/bridge/exceptions";

export class CreateHttpInstance {
  private readonly httpInstance: AxiosInstance;

  constructor(public readonly options: HttpInstanceInterface = {}) {
    this.httpInstance = axios.create({
      baseURL: options.baseURL,
      headers: options.headers,
      timeout: options.timeout,
      params: options.params,
      auth: options.auth,
      cancelToken: options.cancelToken,
      httpAgent: options.httpAgent,
      httpsAgent: options.httpsAgent,
      maxBodyLength: options.maxBodyLength,
      maxRedirects: options.maxRedirects,
      maxContentLength: options.maxContentLength,
      proxy: options.proxy,
      timeoutErrorMessage: options.timeoutErrorMessage,
      formSerializer: options.formSerializer,
      paramsSerializer: options.paramsSerializer,
    });

    this.httpInstance.defaults.headers.common["User-Agent"] =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6000.50 Safari/537.36";
    this.httpInstance.interceptors.request.use((config) => {
      return config;
    });
    this.httpInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data ?? response;
      },
      async (error: any) => {
        if (
          error.response?.status === 401 &&
          this.options.retryOnUnauthorized
        ) {
          try {
            await this.options.getAccessToken?.();
            return this.httpInstance.request(error.config);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        if (error.response) {
          return Promise.reject(error.response.data);
        }
        if (error.request) {
          return Promise.reject(error.request);
        }
        // check if the request was canceled
        if (axios.isCancel(error)) {
          return Promise.reject(new CanceledException("Request canceled"));
        }
        // check if request was timeout
        if (
          error.code === "ECONNABORTED" ||
          error.message === "timeout of " + options.timeout + "ms exceeded"
        ) {
          // retry on timeout if retry is enabled
          if (options.retryOnTimeout) {
            return this.httpInstance.request(error.config);
          }

          return Promise.reject(new TimeoutException("Request timeout"));
        }

        if (error.message === "Network Error") {
          if (options.retryOnNetworkError) {
            return this.httpInstance.request(error.config);
          }

          return Promise.reject(new NetworkException("Network Error"));
        }

        if (error.response?.status === 429 && options.retryOnTooManyRequests) {
          return this.httpInstance.request(error.config);
        }

        if (
          error.response?.status === 500 &&
          options.retryOnInternalServerError
        ) {
          return this.httpInstance.request(error.config);
        }

        if (
          options.retryOnStatusCodes?.includes(error.response?.status) &&
          options.retryOnStatusCodes.length > 0
        ) {
          return this.httpInstance.request(error.config);
        }

        return Promise.reject(error);
      },
    );
  }

  public get<T = object>(url: string, config?: AxiosRequestConfig) {
    return this.httpInstance.get<T>(url, config) as Promise<T>;
  }
}
