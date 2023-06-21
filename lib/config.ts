import { env } from "components/env.mjs";

export const ironOptions = {
  cookieName: "fitform_cookiemonster",
  // password: "mMXDiFGuomKJ6QhkFQi5izrN34Qifw4t",
  password: env.IRONSESSIONPASSWORD,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
