import { FormEvent, useMemo, useState } from "react";
import { ZodSchema } from "zod";

export type FormError = string[] | undefined;

export interface FormValueOption<T, TForm> {
  value: T;
  validator?: ZodSchema<T> | ((currentForm: TForm) => ZodSchema<T>);
}

export type FormOptions<T extends Record<string, any>> = {
  [k in keyof T]: FormValueOption<T[k], T>;
};
export interface FormResult<T> {
  value: T;
  dirty: boolean;
  errors: { [P in keyof T]?: FormError };

  markAsDirty: () => void;
  addError: (k: keyof T, error: string) => void;
  setValue: <K extends keyof T>(k: K, value: T[K]) => FormError;
  reset: (newValue?: T) => void;
  handleSubmit: (cb: (v: T) => void) => (ev: FormEvent) => void;
}
