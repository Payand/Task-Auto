import type { CreateAxiosDefaults } from "axios";

export interface HttpInstanceType extends CreateAxiosDefaults {
  /**
   * Base URL for the API
   */
  baseURL?: string;
  /**
   * Maximum timeout in milliseconds
   * @default 15000 (15 seconds)
   */
  maxTimeout?: number;
  /**
   * Maximum number of retries
   * @default 3
   */
  maxRetries?: number;
  /**
   * Retry delay in milliseconds
   * @default 1000 (1 second)
   */
  retryDelay?: number;
  /**
   * Enable or disable retry on status codes
   * @default [429, 500, 502, 503, 504]
   */
  retryOnStatusCodes?: number[];
  /**
   * Enable or disable retry on network error
   * @default true
   */
  retryOnNetworkError?: boolean;
  /**
   * Enable or disable retry on timeout
   * @default true
   */
  retryOnTimeout?: boolean;
  /**
   * Enable or disable retry on too many requests
   * @default true
   */
  retryOnTooManyRequests?: boolean;
  /**
   * Enable or disable retry on internal server error
   * @default true
   */
  retryOnInternalServerError?: boolean;
  // /**
  //  * Enable or disable the logger and will create an instance of SystemLogger if set to true or pass an instance of SystemLogger
  //  * @default false (disabled)
  //  * @example true | SystemLogger
  //  */
  // logger?: boolean | ReturnType<typeof SystemLogger>;
  /**
   * Enable or disable retry on unauthorized
   *
   * @default false
   */
  retryOnUnauthorized?: boolean;
  /**
   * Whether to get the access token from the client if the Token was expired
   */
  getAccessToken?: () => Promise<string>;
}
