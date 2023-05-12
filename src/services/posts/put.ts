import { AxiosError } from "axios";
import { baseClient } from "common/client";
import { IPost } from "models";

export async function put(data: FormData, name: string) {
  try {
    const result = await baseClient.put<IPost>(`/api/posts/${name}`, data);
    return result;
  } catch (error) {
    const { response } = error as AxiosError<string>;
    return response!;
  }
}
