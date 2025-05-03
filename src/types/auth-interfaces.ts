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
  res: {
    name: string;
    last_name: string;
    email: string;
    exp: string;
    is_verified: boolean;
    is_master: boolean;
    is_super: boolean;
    // admin_status: {}
  };
}
