import { ErrorResponseI } from "./utility-interfaces";

export class FetchError extends Error {
  errorR: ErrorResponseI | null
  status: number;

  constructor(message: string, status: number, errorR: ErrorResponseI | null) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.errorR = errorR;
  }
}
