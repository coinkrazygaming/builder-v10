import { StackServerApp, StackClientApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    emailVerification: "/auth/email-verification",
    passwordReset: "/auth/password-reset",
    home: "/dashboard",
    afterSignIn: "/dashboard",
    afterSignUp: "/dashboard",
    afterSignOut: "/",
  },
});

export const stackClientApp = new StackClientApp({
  tokenStore: "cookie",
  urls: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    emailVerification: "/auth/email-verification",
    passwordReset: "/auth/password-reset",
    home: "/dashboard",
    afterSignIn: "/dashboard",
    afterSignUp: "/dashboard",
    afterSignOut: "/",
  },
});
