import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { z } from "zod";
import { FormEvent } from "react";
import { describe, it, expect, vi } from "vitest";
import { useForm } from "./hook";
import { FormError, FormOptions } from "./types";
import { getValueFromOptions } from "./utils";

interface FormType {
  propertyA: string;
  propertyB: number;
  propertyC: boolean;
}
describe("utils", () => {
  it("should create form object", () => {
    const formOptions: FormOptions<FormType> = {
      propertyA: {
        value: "myValue",
      },
      propertyB: {
        value: 1,
      },
      propertyC: {
        value: true,
      },
    };
    const expected: FormType = {
      propertyA: formOptions.propertyA.value,
      propertyB: formOptions.propertyB.value,
      propertyC: formOptions.propertyC.value,
    };
    const actual = getValueFromOptions<FormType>(formOptions);

    expect(actual).toStrictEqual(expected);
  });
});
