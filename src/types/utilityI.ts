export interface FetchResponse<T> {
  data: T;
  headers: Headers;
  status: number;
}