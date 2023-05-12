import { AxiosError } from "axios";
import { baseClient } from "common/client";
import { IPost } from "models";

export async function fetchAll() {
  try {
    const data = await baseClient.get<IPost[]>("posts");
    console.log(data)
    return data;
  } catch (error) {
    const { response } = error as AxiosError<string>;
    return response!;
  }
}
