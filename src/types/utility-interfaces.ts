export interface FetchResponse<T> {
  result: SuccessResponse<T>;
  status: number;
}

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ErrorResponseI {
  success: false;
  module: string;
  errors: string[];
}

export interface SponsorInfoI {
  text?: string;
  level?: string;
  imagePath?: string;
}