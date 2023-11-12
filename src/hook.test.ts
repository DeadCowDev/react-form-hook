import { renderHook, act } from "@testing-library/react";
import { z } from "zod";
import { FormEvent } from "react";
import { describe, it, expect, vi } from "vitest";
import { useForm } from "./hook";
import { FormError } from "./types";
interface FormType {
  propertyA: string;
  propertyB: number;
  propertyC: boolean;
}

describe("Hook", () => {
  it("should create form object", () => {
    const formInitialValue: FormType = {
      propertyA: "myValue",
      propertyB: 1,
      propertyC: true,
    };
    const { result } = renderHook(() =>
      useForm<FormType>({
        propertyA: {
          value: formInitialValue.propertyA,
        },
        propertyB: {
          value: formInitialValue.propertyB,
        },
        propertyC: {
          value: formInitialValue.propertyC,
        },
      })
    );
    const sut = result.current;
    expect(sut.value).toStrictEqual(formInitialValue);
    expect(sut.errors).toStrictEqual({});
    expect(sut.dirty).toBe(false);
  });
  it("Should mark form as dirty when markAsDirty is called", () => {
    const formInitialValue: FormType = {
      propertyA: "myValue",
      propertyB: 1,
      propertyC: true,
    };
    const { result } = renderHook(() =>
      useForm<FormType>({
        propertyA: {
          value: formInitialValue.propertyA,
        },
        propertyB: {
          value: formInitialValue.propertyB,
        },
        propertyC: {
          value: formInitialValue.propertyC,
        },
      })
    );
    act(() => {
      result.current.markAsDirty();
    });
    const sut = result.current;
    expect(sut.dirty).toBe(true);
  });
  it("Should reset form", () => {
    const formInitialValue: FormType = {
      propertyA: "myValue",
      propertyB: 1,
      propertyC: true,
    };
    const { result } = renderHook(() =>
      useForm<FormType>({
        propertyA: {
          value: formInitialValue.propertyA,
        },
        propertyB: {
          value: formInitialValue.propertyB,
        },
        propertyC: {
          value: formInitialValue.propertyC,
        },
      })
    );
    act(() => {
      result.current.setValue("propertyA", "test");
      result.current.setValue("propertyB", 1);
      result.current.setValue("propertyC", true);
      result.current.reset();
    });
    const sut = result.current;
    expect(sut.value).toStrictEqual(formInitialValue);
    expect(sut.errors).toStrictEqual({});
    expect(sut.dirty).toBe(false);
  });
  it("Should reset form with value passed as argument", () => {
    const formInitialValue: FormType = {
      propertyA: "myValue",
      propertyB: 1,
      propertyC: true,
    };
    const newFormValue: FormType = {
      propertyA: "myValue",
      propertyB: 1,
      propertyC: true,
    };
    const { result } = renderHook(() =>
      useForm<FormType>({
        propertyA: {
          value: formInitialValue.propertyA,
        },
        propertyB: {
          value: formInitialValue.propertyB,
        },
        propertyC: {
          value: formInitialValue.propertyC,
        },
      })
    );
    act(() => {
      result.current.reset(newFormValue);
    });
    const sut = result.current;
    expect(sut.value).toStrictEqual(newFormValue);
    expect(sut.errors).toStrictEqual({});
    expect(sut.dirty).toBe(false);
  });
  it("Should change form property value and return validation result", () => {
    const formInitialValue: FormType = {
      propertyA: "myValue",
      propertyB: 1,
      propertyC: true,
    };
    const { result } = renderHook(() =>
      useForm<FormType>({
        propertyA: {
          value: formInitialValue.propertyA,
          validator: z.string().min(5, "Error message length 5"),
        },
        propertyB: {
          value: formInitialValue.propertyB,
        },
        propertyC: {
          value: formInitialValue.propertyC,
          validator: () => z.boolean(),
        },
      })
    );

    let resultPropertyA: FormError;
    let resultPropertyB: FormError;
    let resultPropertyC: FormError;
    act(() => {
      resultPropertyA = result.current.setValue("propertyA", "123");
      resultPropertyB = result.current.setValue("propertyB", 1);
      resultPropertyC = result.current.setValue("propertyC", true);
    });
    const sut = result.current;

    expect(resultPropertyA).toStrictEqual(["Error message length 5"]);
    expect(resultPropertyB).toBeUndefined();
    expect(resultPropertyC).toBeUndefined();
    expect(sut.errors).toStrictEqual({});
    expect(sut.dirty).toBe(true);
  });
  it("Should add error to form property", () => {
    const formInitialValue: FormType = {
      propertyA: "myValue",
      propertyB: 1,
      propertyC: true,
    };
    const { result } = renderHook(() =>
      useForm<FormType>({
        propertyA: {
          value: formInitialValue.propertyA,
        },
        propertyB: {
          value: formInitialValue.propertyB,
        },
        propertyC: {
          value: formInitialValue.propertyC,
        },
      })
    );

    act(() => {
      result.current.addError(
        "propertyA",
        "Error message from server response"
      );
    });
    const sut = result.current;

    expect(sut.errors).toStrictEqual({
      propertyA: ["Error message from server response"],
    });
  });
  it("Should run callback function on submit", () => {
    const formInitialValue: FormType = {
      propertyA: "myValue",
      propertyB: 1,
      propertyC: true,
    };
    const { result } = renderHook(() =>
      useForm<FormType>({
        propertyA: {
          value: formInitialValue.propertyA,
        },
        propertyB: {
          value: formInitialValue.propertyB,
        },
        propertyC: {
          value: formInitialValue.propertyC,
        },
      })
    );

    const fn = vi.fn();

    const ev: Pick<FormEvent, "preventDefault"> = {
      preventDefault: vi.fn(),
    };

    act(() => {
      result.current.handleSubmit(fn)(ev as any);
    });
    expect(ev.preventDefault).toBeCalled();
    expect(fn).toBeCalledWith(formInitialValue);
  });
  it("Should run promise callback function on submit", () => {
    const formInitialValue: FormType = {
      propertyA: "myValue",
      propertyB: 1,
      propertyC: true,
    };
    const { result } = renderHook(() =>
      useForm<FormType>({
        propertyA: {
          value: formInitialValue.propertyA,
        },
        propertyB: {
          value: formInitialValue.propertyB,
        },
        propertyC: {
          value: formInitialValue.propertyC,
        },
      })
    );

    const fn = vi.fn<any, Promise<void>>();

    const ev: Pick<FormEvent, "preventDefault"> = {
      preventDefault: vi.fn(),
    };

    act(() => {
      result.current.handleSubmit(fn)(ev as any);
    });
    expect(ev.preventDefault).toBeCalled();
    expect(fn).toBeCalledWith(formInitialValue);
  });
  it("Should not run callback function on submit if there are errors", () => {
    const formInitialValue: FormType = {
      propertyA: "myValue",
      propertyB: 1,
      propertyC: true,
    };
    const { result } = renderHook(() =>
      useForm<FormType>({
        propertyA: {
          value: formInitialValue.propertyA,
          validator: () =>
            z
              .string()
              .min(
                formInitialValue.propertyA.length + 1,
                "Should be X characters long"
              ),
        },
        propertyB: {
          value: formInitialValue.propertyB,
          validator: z
            .number()
            .min(formInitialValue.propertyB + 1, "Should be at least X"),
        },
        propertyC: {
          value: formInitialValue.propertyC,
          validator: z.boolean(),
        },
      })
    );

    const fn = vi.fn();

    const ev: Pick<FormEvent, "preventDefault"> = {
      preventDefault: vi.fn(),
    };

    act(() => {
      result.current.handleSubmit(fn)(ev as any);
    });
    expect(ev.preventDefault).toBeCalled();
    expect(fn).not.toHaveBeenCalled();
    expect(result.current.errors).toStrictEqual({
      propertyA: ["Should be X characters long"],
      propertyB: ["Should be at least X"],
    });
  });
});
