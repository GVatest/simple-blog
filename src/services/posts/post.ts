import { AxiosError } from "axios";
import { baseClient } from "common/client";
import { IPost } from "models";

export async function post(data: FormData) {
  try {
    const result = await baseClient.post<IPost>(`/api/posts`, data);
    return result;
  } catch (error) {
    const { response } = error as AxiosError<string>;
    return response!;
  }
}
