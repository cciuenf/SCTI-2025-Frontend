export interface AuthCredentialsI {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenI {
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  token_str: string;
}
