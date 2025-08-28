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

export interface UserBasicInfo {
  Name: string;
  LastName: string;
  Email: string;
  last_name?: string;
  is_uenf?: boolean;
  uenf_semester?: string;
}

export interface UserAccessTokenJwtPayload extends UserBasicInfo {
  id: string;
  name: string;
  last_name: string;
  email: string;
  admin_status: string
  is_verified: boolean;
  is_event_creator: boolean;
  is_super: boolean;
  exp: string;
}

export interface UserRefreshTokenJwtPayload {
  id: string;
  user_agent: string;
  ip_address: string;
  last_used: Date | string;
  exp: Date | string;
}
