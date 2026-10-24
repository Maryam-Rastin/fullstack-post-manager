import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { Post } from "..";
import { server } from "../test/server";
import useQuery from "./useQuery";

const API = "http://localhost:3001/api";

const posts: Post[] = [{ id: "1", title: "First", content: "First content" }];

// Lets a test hold a request open until it decides to release it
const createGate = () => {
  let open!: () => void;
  const promise = new Promise<void>((resolve) => {
    open = resolve;
  });
  return { promise, open };
};

describe("useQuery errors and loading", () => {
  it("sets error when the API responds with 500", async () => {
    server.use(
      http.get(`${API}/post`, () =>
        HttpResponse.json({ message: "boom" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useQuery<Post[]>("post"));

    await waitFor(() => {
      expect(result.current.error).toBe("Request failed with status code 500");
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toBeUndefined();
  });

  it("sets error on a network failure", async () => {
    server.use(http.get(`${API}/post`, () => HttpResponse.error()));

    const { result } = renderHook(() => useQuery<Post[]>("post"));

    await waitFor(() => expect(result.current.error).toBe("Network Error"));
    expect(result.current.data).toBeUndefined();
  });

  it("is loading while the request is pending, then stops", async () => {
    const gate = createGate();
    server.use(
      http.get(`${API}/post`, async () => {
        await gate.promise;
        return HttpResponse.json(posts);
      }),
    );

    const { result } = renderHook(() => useQuery<Post[]>("post"));

    expect(result.current.loading).toBe(true);

    gate.open();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(posts);
  });
});