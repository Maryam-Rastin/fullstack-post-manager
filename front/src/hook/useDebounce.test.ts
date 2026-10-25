import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebounce", () => {
  it("starts as an empty string, even when given a value", () => {
    const { result } = renderHook(() => useDebounce("hello"));
    expect(result.current).toBe("");
  });

  it("does not update before the delay has passed", () => {
    const { result } = renderHook(() => useDebounce("hello"));

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(result.current).toBe("");
  });

  it("updates once the default 500ms delay has passed", () => {
    const { result } = renderHook(() => useDebounce("hello"));

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("hello");
  });

  it("respects a custom delay", () => {
    const { result } = renderHook(() => useDebounce("hello", 100));

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe("hello");
  });

  it("restarts the timer when the value changes", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "a" },
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    rerender({ value: "ab" });

    // 600ms in total: the first timer would have fired by now if it weren't cleared
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("ab");
  });
});
