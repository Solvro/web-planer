import { jwtGuard } from "@maximemrf/adonisjs-jwt/jwt_config";
import { BaseJwtContent, JwtGuardUser } from "@maximemrf/adonisjs-jwt/types";

import { defineConfig } from "@adonisjs/auth";
import { sessionGuard, sessionUserProvider } from "@adonisjs/auth/session";
import { Authenticators, InferAuthEvents } from "@adonisjs/auth/types";

import User from "#models/user";

const authConfig = defineConfig({
  default: "jwt",
  guards: {
    web: sessionGuard({
      useRememberMeTokens: false,
      provider: sessionUserProvider({
        model: () => import("#models/user"),
      }),
    }),
    // add the jwt guard
    jwt: jwtGuard({
      // tokenExpiresIn can be a string or a number, it can be optional
      tokenExpiresIn: 60 * 60 * 24 * 7,
      // if you want to use cookies for the authentication instead of the bearer token (optional)
      useCookies: true,
      provider: sessionUserProvider({
        model: () => import("#models/user"),
      }),
      content: (user: JwtGuardUser<unknown>): BaseJwtContent => {
        const typedUser = user.getOriginal() as User;
        return {
          userId: typedUser.getId(),
        };
      },
    }),
  },
});

export default authConfig;

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module "@adonisjs/auth/types" {
  export interface Authenticators
    extends InferAuthenticators<typeof authConfig> {}
}
declare module "@adonisjs/core/types" {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
