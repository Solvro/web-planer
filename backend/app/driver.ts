/*
|--------------------------------------------------------------------------
| Ally Oauth driver
|--------------------------------------------------------------------------
|
| Make sure you through the code and comments properly and make necessary
| changes as per the requirements of your implementation.
|
*/

/**
|--------------------------------------------------------------------------
 *  Search keyword "YourDriver" and replace it with a meaningful name
|--------------------------------------------------------------------------
 */

import { Oauth1Driver } from '@adonisjs/ally'
import type { HttpContext } from '@adonisjs/core/http'
import type { AllyDriverContract, AllyUserContract, ApiRequestContract } from '@adonisjs/ally/types'

/**
 *
 * Access token returned by your driver implementation. An access
 * token must have "token" and "type" properties and you may
 * define additional properties (if needed)
 */
export type YourDriverAccessToken = {
  token: string
  secret: string
}

/**
 * Scopes accepted by the driver implementation.
 */
export type YourDriverScopes = string

/**
 * The configuration accepted by the driver implementation.
 */
export type YourDriverConfig = {
  clientId: string
  clientSecret: string
  callbackUrl: string
  authorizeUrl?: string
  accessTokenUrl?: string
  userInfoUrl?: string
}

/**
 * Driver implementation. It is mostly configuration driven except the API call
 * to get user info.
 */
export class YourDriver
  extends Oauth1Driver<YourDriverAccessToken, YourDriverScopes>
  implements AllyDriverContract<YourDriverAccessToken, YourDriverScopes>
{
  protected oauthTokenCookieName: string = 'usos_oauth_token'
  protected oauthTokenParamName: string = 'oauth_token'
  protected oauthTokenVerifierName: string = 'oauth_verifier'
  protected errorParamName: string = 'error'
  protected requestTokenUrl: string = 'https://'
  protected authorizeUrl: string = ''
  protected accessTokenUrl: string
  protected scopeParamName: string
  protected scopesSeparator: string
  user(
    callback?: (request: ApiRequestContract) => void
  ): Promise<AllyUserContract<YourDriverAccessToken>> {
    throw new Error('Method not implemented.')
  }
  userFromTokenAndSecret(
    token: string,
    secret: string,
    callback?: (request: ApiRequestContract) => void
  ): Promise<AllyUserContract<{ token: string; secret: string }>> {
    throw new Error('Method not implemented.')
  }
  accessDenied(): boolean {
    throw new Error('Method not implemented.')
  }
}

/**
 * The factory function to reference the driver implementation
 * inside the "config/ally.ts" file.
 */
export function YourDriverService(config: YourDriverConfig): (ctx: HttpContext) => YourDriver {
  return (ctx) => new YourDriver(ctx, config)
}
