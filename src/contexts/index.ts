import { IPost } from "models";
import { createContext } from "react";

export const PostContext = createContext<IPost>({
  id: 0,
  title: "",
  description: "",
  slug: "",
  date: "",
});
