export type Response<T = undefined> = {
  data?: T;
  errorCode?: number;
  error?: string;
};
