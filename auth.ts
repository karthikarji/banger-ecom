import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SignInCredentials } from "./app/types";

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {}, //if you define credentials here, we will get default credentials
      async authorize(credentials, request) {
        const { email, password } = credentials as SignInCredentials;
        try {
          console.log("inside server");
          const apiResponse = await fetch(
            "http://localhost:3000/api/users/signin",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );

          console.log(apiResponse.ok);
          const res = await apiResponse.json();
          console.log(res);

          console.log("before return");
          return res.user.id;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(authConfig);

// //by default it supports server side rendering

// import NextAuth from "next-auth";
// import { authConfig } from "./auth.config";
// import Credentials from "next-auth/providers/credentials";
// import { SignInCredentials } from "./app/types";

// export const {
//   auth,
//   signIn,
//   signOut,
//   handlers: { GET, POST },
// } = NextAuth({
//   ...authConfig,
//   providers: [
//     Credentials({
//       type: "credentials",
//       credentials: {}, //if you define credentials here, we will get default credentials
//       async authorize(credentials, request) {
//         console.log("new server");
//         const { email, password } = credentials as SignInCredentials;
//         try {
//           const apiResponse = await fetch(
//             "http://localhost:3000/api/users/signin",
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ email, password }),
//             }
//           );
//           console.log("inside server");
//           console.log(apiResponse.ok);
//           const res = await apiResponse.json();
//           console.log(res);
//           if (res.error) return null;

//           console.log("before return");
//           return res.user;
//         } catch (error) {
//           console.log(error);
//           return null;
//         }
//       },
//     }),
//   ],
// });
