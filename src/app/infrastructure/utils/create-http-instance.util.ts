import axios, { AxiosResponse } from "axios";
// Types and Interfaces
import { HttpInstanceType } from "@root/app/infrastructure/interfaces";
import type { AxiosRequestConfig, AxiosInstance } from "axios";
// Exceptions
import { CanceledException, NetworkException, TimeoutException } from "@root/app/infrastructure/exceptions";


export class CreateHttpInstance {
  private readonly httpInstance: AxiosInstance;

  constructor(public readonly options: HttpInstanceType = {}) {
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
      (error: any) => {
        // unauthorized access token and refresh token
        if (
          error.response?.status === 401 &&
          this.options.retryOnUnauthorized
        ) {
          return this.options
            .getAccessToken?.()
            .then(() => {
              return this.httpInstance.request(error.config);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
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

        // check if error is a network error
        if (error.message === "Network Error") {
          // retry on network error if retry is enabled
          if (options.retryOnNetworkError) {
            return this.httpInstance.request(error.config);
          }

          return Promise.reject(new NetworkException("Network Error"));
        }

        // retry on too many requests if retry is enabled
        if (error.response?.status === 429 && options.retryOnTooManyRequests) {
          return this.httpInstance.request(error.config);
        }

        // retry on internal server error if retry is enabled
        if (
          error.response?.status === 500 &&
          options.retryOnInternalServerError
        ) {
          return this.httpInstance.request(error.config);
        }

        // retry on these status codes if retry is enabled
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
