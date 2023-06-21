import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getIronSession } from "iron-session";
import { ironOptions } from "lib/config";

/** I don tthink this is being used.... */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const session = await getIronSession(opts.req, opts.res, ironOptions);

  return {
    session,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;