export interface AuthCredentialsI {
  data: {
    access_token: string;
    refresh_token: string;
  };
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
  admin_type: string;
  is_verified: boolean
  // event:
}
