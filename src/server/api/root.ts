import { createTRPCRouter } from "components/server/api/trpc";
import { exampleRouter } from "components/server/api/routers/example";
import { loginRouter } from "components/server/api/routers/login";
import { stripeRouter } from "./checkout_sessions";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  login: loginRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
