import { IPost } from "models";
import { object, string } from "zod";

export const SCredentials = object({
  username: string({ required_error: "Username required" }).min(1, {
    message: "Username required",
  }),
  password: string({ required_error: "Password required" }).min(1, {
    message: "Password required",
  }),
});

export const SPost = object({
  title: string(),
  description: string(),
}).strict();

export const SPostOptional = object({
  title: string().optional(),
  description: string().optional(),
}).strict();
