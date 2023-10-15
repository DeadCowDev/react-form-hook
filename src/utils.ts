import { FormOptions } from "./types";

export const getValueFromOptions = <T extends Record<string, any>>(
  v: FormOptions<T>
): T => {
  const result: Record<string, unknown> = {};
  Object.keys(v).forEach((k) => {
    result[k] = v[k].value;
  });
  return result as T;
};
