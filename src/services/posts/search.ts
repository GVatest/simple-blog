import { baseClient } from "common/client";

export function search(query: string) {
  return baseClient.get(`/api/posts/search?q=${query}`);
}
