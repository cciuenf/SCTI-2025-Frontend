export class FetchError extends Error {
  status: number;
  headers: Headers;

  constructor(message: string, status: number, headers: Headers) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.headers = headers;
  }
}
