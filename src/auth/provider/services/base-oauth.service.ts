import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TypeBaseProviderOptions } from './types/base-provider-options.types';
import { TypeUserInfo } from './types/user-info.types';

@Injectable()
export class BaseOAuthService {
  private BASE_URL: string;

  constructor(private readonly options: TypeBaseProviderOptions) {}

  public getAuthUrl() {
    const query = new URLSearchParams({
      response_type: 'code',
      client_id: this.options.client_id,
      redirect_uri: this.getRedirectUrl(),
      scope: this.options.scopes.join(' '),
      access_type: 'offline',
      prompt: 'select_account',
    });

    return `${this.options.authorize_url}?${query.toString()}`;
  }

  public async findUserByCode(code: string): Promise<TypeUserInfo> {
    const client_id = this.options.client_id;
    const client_secret = this.options.client_secret;

    const tokenQuery = new URLSearchParams({
      client_id,
      client_secret,
      code,
      redirect_uri: this.getRedirectUrl(),
      grant_type: 'authorization_code',
    });

    const tokenRequest = await fetch(this.options.access_url, {
      method: 'POST',
      body: tokenQuery,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });

    if (!tokenRequest.ok) {
      throw new BadRequestException('Failed to get token');
    }

    const tokens = await tokenRequest.json();

    if (!tokens.access_token) {
      throw new BadRequestException('Failed to get access token');
    }

    const userRequest = await fetch(this.options.profile_url, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const userResponse = await userRequest.json();

    if (!userRequest.ok) {
      const userErrorText = await userRequest.text();
      throw new UnauthorizedException(`${userErrorText}`);
    }

    const user = await this.extractUserInfo(userResponse);

    return {
      ...user,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at || tokens.expires_in,
      provider: this.options.name,
    };
  }

  protected async extractUserInfo(data: any): Promise<TypeUserInfo> {
    return {
      ...data,
      provider: this.options.name,
    };
  }

  public getRedirectUrl(): string {
    return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`;
  }

  set baseUrl(url: string) {
    this.BASE_URL = url;
  }

  get name() {
    return this.options.name;
  }

  get access_url() {
    return this.options.access_url;
  }

  get profile_url() {
    return this.options.profile_url;
  }

  get scopes() {
    return this.options.scopes;
  }
}
