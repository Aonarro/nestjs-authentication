export type TypeUserInfo = {
  id: string;
  name: string;
  picture: string;
  email: string;
  access_token?: string | null;
  refresh_token?: string;
  expires_at?: number;
  provider: string;
};
