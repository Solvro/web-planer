import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthEndpoint } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { z } from "zod";

import {
  getUsosAccessToken,
  getUsosRequestToken,
  getUsosUserProfile,
} from "../usos";

export const usosAuth = () => {
  return {
    id: "usos-auth",
    endpoints: {
      usosLogin: createAuthEndpoint(
        "/usos/login",
        {
          method: "GET",
        },
        async (ctx) => {
          const { token, secret, authorizeUrl } = await getUsosRequestToken(
            `${ctx.context.baseURL}/usos/callback`,
          );

          if (!token || !secret || !authorizeUrl) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to get request token",
            });
          }

          await ctx.setSignedCookie(
            "usos_oauth_state",
            JSON.stringify({ token, secret }),
            ctx.context.secret,
            {
              maxAge: 60 * 10,
              path: "/",
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            },
          );

          return ctx.redirect(authorizeUrl);
        },
      ),
      usosCallback: createAuthEndpoint(
        "/usos/callback",
        {
          method: "GET",
          query: z.object({
            oauth_token: z.string(),
            oauth_verifier: z.string(),
          }),
        },
        async (ctx) => {
          const { oauth_token, oauth_verifier } = ctx.query;

          const stateCookie = await ctx.getSignedCookie(
            "usos_oauth_state",
            ctx.context.secret,
          );

          if (!stateCookie) {
            throw new APIError("BAD_REQUEST", {
              message: "Missing OAuth state",
            });
          }

          const state = JSON.parse(stateCookie) as {
            token: string;
            secret: string;
          };

          if (state.token !== oauth_token) {
            throw new APIError("BAD_REQUEST", {
              message: "Invalid OAuth token",
            });
          }

          const { token: accessToken, secret: accessSecret } =
            await getUsosAccessToken(oauth_token, oauth_verifier, state.secret);

          if (!accessToken || !accessSecret) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to get access token",
            });
          }

          const usosUser = await getUsosUserProfile(accessToken, accessSecret);

          if (!usosUser) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Failed to get user profile",
            });
          }

          const email = usosUser.email ?? `${usosUser.id}@usos.pwr.edu.pl`;

          const existingUser =
            await ctx.context.internalAdapter.findUserByEmail(email);

          let user;
          if (!existingUser) {
            user = await ctx.context.internalAdapter.createUser({
              email,
              emailVerified: true,
              name: `${usosUser.first_name} ${usosUser.last_name}`,
              image: usosUser.photo_urls?.["100x100"] ?? null,
              firstName: usosUser.first_name,
              lastName: usosUser.last_name,
              studentNumber: usosUser.student_number
                ? Number.parseInt(usosUser.student_number)
                : null,
              usosId: usosUser.id,
            });
          } else {
            await ctx.context.internalAdapter.updateUser(existingUser.user.id, {
              firstName: usosUser.first_name,
              lastName: usosUser.last_name,
              studentNumber: usosUser.student_number
                ? Number.parseInt(usosUser.student_number)
                : null,
              usosId: usosUser.id,
            });
            user = existingUser.user;
          }

          const session = await ctx.context.internalAdapter.createSession(
            user.id,
          );

          await setSessionCookie(ctx, {
            session,
            user,
          });

          return ctx.redirect("/plans");
        },
      ),
    },
  } satisfies BetterAuthPlugin;
};
