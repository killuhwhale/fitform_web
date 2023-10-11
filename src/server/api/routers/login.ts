import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "components/server/api/trpc";
import { User } from "lib/session";

import { env } from "components/env.mjs";

type loginResult = { access: string };
type removeResult = { success: boolean; error: string };

/** Should rename to reflect Django API access */
export const loginRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // makes request to FITFORM login api
      // /token/
      console.log("Logging in...");
      let data: loginResult | null = null;
      try {
        const res = await fetch(`${env.BASE_URL}/token/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });
        data = (await res.json()) as loginResult;
      } catch (err) {
        console.log("error getting token: ", err);
        return {
          loggedIn: false,
          error: err,
          token: "",
        };
      }

      let loggedIn = false;
      let error = null;
      let token = "";
      console.log("Loggedin in res: ", data);
      if (data.access) {
        console.log("Returning token: ", data.access);
        token = data.access;
        loggedIn = true;

        const userInfo: User = (await (
          await fetch(`${env.BASE_URL}/users/user_info/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.access}`,
            },
          })
        ).json()) as User;

        console.log("Saving user to session: ", userInfo);
        ctx.session.user = {
          token: token,
          email: userInfo.email,
          username: userInfo.username,
          id: userInfo.id,
          subscribed: userInfo.subscribed,
          customer_id: userInfo.customer_id,
          sub_end_date: new Date(userInfo.sub_end_date),
        } as User;

        await ctx.session.save();
        console.log("Session saved: ", ctx.session);
      } else {
        error = true;
      }

      return {
        loggedIn,
        error,
        token,
      };
    }),

  logout: publicProcedure
    .input(z.object({}))
    .mutation(async ({ input, ctx }) => {
      // makes request to FITFORM login api
      // /token/
      ctx.session.destroy();

      ctx.session.user = {
        token: "",
        email: "",
        username: "",
        id: 0,
        subscribed: false,
        sub_end_date: new Date(),
        customer_id: "",
      } as User;

      await ctx.session.save();

      return {
        loggedOut: true,
      };
    }),

  removeAccount: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("Using accesstoken: ", ctx.user.token);
        const res = await fetch(`${env.BASE_URL}/account/remove/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ctx.user.token}`,
          },
          body: JSON.stringify({
            email: input.email,
          }),
        });
        const data = (await res.json()) as removeResult;
        return data;
      } catch (err) {
        console.log("Error rm account: ", err);
        return {
          success: false,
          error: err,
        };
      }
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});
