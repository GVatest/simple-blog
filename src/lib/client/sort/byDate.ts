import { IPost } from "models";

export function sortByDate(posts: IPost[], isDescend: boolean) {
  const sortedPosts = [...posts];
  sortedPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  if (!isDescend) {
    sortedPosts.reverse();
  }
  return sortedPosts;
}
