import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosRequestHeaders } from "axios";
import Logger from "../utilities/logger";
import { withRetry, RetryConfig, DEFAULT_RETRY_CONFIG } from "../utilities/retry";

export class HttpClient {
  private static readonly DEFAULT_TIMEOUT = 5 * 1000; // 5 seconds
  readonly client: AxiosInstance;
  private retryConfig: RetryConfig;

  constructor({
    headers,
    handleSuccess = HttpClient.defaultHandleSuccess,
    handleError = HttpClient.defaultHandleError,
    config,
    retryConfig = DEFAULT_RETRY_CONFIG,
  }: {
    headers?: AxiosRequestHeaders;
    handleSuccess?: any;
    handleError?: any;
    config?: AxiosRequestConfig;
    retryConfig?: RetryConfig;
  }) {
    const client = axios.create({
      timeout: config?.timeout || HttpClient.DEFAULT_TIMEOUT,
      headers: { "Content-Type": "application/json", ...headers },
    });

    client.interceptors.request.use((config) => {
      Logger.info({
        message: "Outgoing HTTP request",
        method: config.method?.toUpperCase(),
        url: config.url,
        headers: config.headers,
      });
      return config;
    });

    client.interceptors.response.use(
      (response) => {
        Logger.info({
          message: "HTTP response received",
          status: response.status,
          url: response.config.url,
          method: response.config.method?.toUpperCase(),
        });
        return handleSuccess(response);
      },
      (error) => {
        Logger.error({
          message: "HTTP request failed",
          error: error.message,
          status: error.response?.status,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
        });
        return handleError(error);
      }
    );

    this.client = client;
    this.retryConfig = retryConfig;
  }

  private static defaultHandleSuccess(response: AxiosResponse) {
    return response;
  }

  private static defaultHandleError(error: any) {
    throw error;
  }

  async get(url: string, config?: AxiosRequestConfig) {
    return withRetry(() => this.client.get(url, config), this.retryConfig);
  }

  async post(url: string, data?: any, config?: AxiosRequestConfig) {
    return withRetry(() => this.client.post(url, data, config), this.retryConfig);
  }
}
