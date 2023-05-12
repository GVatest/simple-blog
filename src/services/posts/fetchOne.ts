import { AxiosError } from "axios";
import { baseClient } from "common/client";
import { IPost } from "models";

export async function fetchOne(slug: string) {
  try {
    const data = await baseClient.get<IPost>(`posts/${slug}`);
    return data;
  } catch (error) {
    const { response } = error as AxiosError<string>;
    return response!;
  }
}
