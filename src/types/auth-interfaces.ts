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

export interface UserAccessTokenJwtPayload {
  name: string;
  last_name: string;
  email: string;
  // admin_status: {}
  is_verified: boolean;
  is_event_creator: boolean;
  is_super: boolean;
  exp: string;
}
