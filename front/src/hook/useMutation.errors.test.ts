import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { toast } from "react-toastify";
import type { Post } from "..";
import { HttpMethod } from "../helper/constant";
import { server } from "../test/server";
import useMutation from "./useMutation";

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn() },
}));

const API = "http://localhost:3001/api";

const post: Post = { id: "1", title: "Hello", content: "World" };

const createGate = () => {
  let open!: () => void;
  const promise = new Promise<void>((resolve) => {
    open = resolve;
  });
  return { promise, open };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useMutation errors and loading", () => {
  it("sets error and shows a toast when the API responds with 500", async () => {
    server.use(
      http.post(`${API}/post`, () =>
        HttpResponse.json({ message: "boom" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useMutation<Post>());

    act(() => {
      result.current.execute({
        url: "post",
        method: HttpMethod.POST,
        body: post,
      });
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Request failed with status code 500");
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith("Something isn't right!");
  });

  it("shows a toast on a network failure", async () => {
    server.use(http.delete(`${API}/post/1`, () => HttpResponse.error()));

    const { result } = renderHook(() => useMutation());

    act(() => {
      result.current.execute({ url: "post/1", method: HttpMethod.DELETE });
    });

    await waitFor(() => expect(result.current.error).toBe("Network Error"));
    expect(toast.error).toHaveBeenCalledWith("Something isn't right!");
  });

  it("is loading while the request is pending, then stops", async () => {
    const gate = createGate();
    server.use(
      http.post(`${API}/post`, async () => {
        await gate.promise;
        return HttpResponse.json(post);
      }),
    );

    const { result } = renderHook(() => useMutation<Post>());

    act(() => {
      result.current.execute({
        url: "post",
        method: HttpMethod.POST,
        body: post,
      });
    });

    expect(result.current.loading).toBe(true);

    gate.open();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(post);
  });
});