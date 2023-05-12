import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
  }
}

// declare module "next-auth/jwt" {
//   interface JWT {
//     username: string;
//   }
// }
