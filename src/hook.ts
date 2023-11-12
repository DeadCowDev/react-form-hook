import { useMemo, useState } from "react";
import { FormOptions, FormResult } from "./types";
import { getValueFromOptions } from "./utils";

export function useForm<T extends Record<string, any>>(
  config: FormOptions<T>
): FormResult<T> {
  const [initialValue, setInitialValue] = useState(() =>
    getValueFromOptions(config)
  );

  const [formResult, setFormResult] = useState<
    Pick<FormResult<T>, "dirty" | "errors" | "value" | "loading">
  >(() => ({
    dirty: false,
    errors: {},
    value: initialValue,
    loading: false,
  }));

  const updateValidity = () => {
    const errors: typeof formResult.errors = {};

    Object.keys(config).forEach((k: keyof T) => {
      const validator = config[k].validator;
      const value = formResult.value[k];
      if (validator) {
        const result =
          typeof validator === "function"
            ? validator(formResult.value)
            : validator;
        const error = result.safeParse(value);
        if (error.success) {
          return;
        }

        errors[k] = error.error.errors.map((e) => e.message);
      }
    });

    const newValue: typeof formResult = { ...formResult, errors };

    setFormResult(() => newValue);
    return Object.keys(errors).length === 0;
  };

  const res = useMemo<FormResult<T>>(() => {
    return {
      ...formResult,
      reset: (newValue?: T) => {
        const valueToResetTo = newValue || initialValue;
        if (newValue) {
          setInitialValue(initialValue);
        }
        setFormResult({
          dirty: false,
          loading: false,
          errors: {},
          value: valueToResetTo,
        });
      },
      handleSubmit: (cb) => {
        return async (ev) => {
          ev.preventDefault();
          const valid = updateValidity();
          if (!valid) {
            return;
          }

          try {
            setFormResult((prev) => ({ ...prev, loading: true }));
            const cbResult = cb(formResult.value);
            if (cbResult instanceof Promise) {
              await cbResult;
            }
          } finally {
            setFormResult((prev) => ({ ...prev, loading: false }));
          }
        };
      },
      setValue: (k, v) => {
        setFormResult((prev) => {
          return {
            ...prev,
            dirty: true,
            value: {
              ...prev.value,
              [k]: v,
            },
          };
        });

        const propertyValidator = config[k].validator;
        if (!propertyValidator) {
          return undefined;
        }
        const validator =
          typeof propertyValidator === "function"
            ? propertyValidator(formResult.value)
            : propertyValidator;
        const validatorResult = validator.safeParse(v);

        if (validatorResult.success) {
          return undefined;
        }

        return validatorResult.error.errors.map((e) => e.message);
      },
      markAsDirty: () => {
        setFormResult((prev) => ({ ...prev, dirty: true }));
      },
      addError: (k, err) => {
        setFormResult((prev) => {
          const errors = prev.errors[k] || [];
          errors.push(err);
          return {
            ...prev,
            errors: {
              ...prev.errors,
              [k]: errors,
            },
          };
        });
      },
    };
  }, [config, formResult, initialValue]);

  return res;
}
