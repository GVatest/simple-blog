import { AxiosError } from "axios";
import { baseClient } from "common/client";
import { IPost } from "models";

export async function del(name: string) {
  try {
    const result = await baseClient.delete<IPost>(`/api/posts/${name}`);
    return result;
  } catch (error) {
    const { response } = error as AxiosError<string>;
    return response!;
  }
}
