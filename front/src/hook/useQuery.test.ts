import { describe, it, expect } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { Post } from "..";
import { server } from "../test/server";
import useQuery from "./useQuery";

const API = "http://localhost:3001/api";

const posts: Post[] = [{ id: "1", title: "First", content: "First content" }];

describe("useQuery", () => {
  it("fetches data on mount", async () => {
    server.use(http.get(`${API}/post`, () => HttpResponse.json(posts)));

    const { result } = renderHook(() => useQuery<Post[]>("post"));

    await waitFor(() => expect(result.current.data).toEqual(posts));
  });

  it("fetches again when the url changes", async () => {
    server.use(
      http.get(`${API}/post`, ({ request }) => {
        const search = new URL(request.url).searchParams.get("search");
        return HttpResponse.json(search ? [] : posts);
      }),
    );

    const { result, rerender } = renderHook(
      ({ url }) => useQuery<Post[]>(url),
      { initialProps: { url: "post" } },
    );
    await waitFor(() => expect(result.current.data).toEqual(posts));

    rerender({ url: "post?search=zzz" });

    await waitFor(() => expect(result.current.data).toEqual([]));
  });

  it("does not fetch until refetch is called when lazy", async () => {
    let calls = 0;
    server.use(
      http.get(`${API}/post`, () => {
        calls++;
        return HttpResponse.json(posts);
      }),
    );

    const { result } = renderHook(() => useQuery<Post[]>("post", true));

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(calls).toBe(0);

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => expect(result.current.data).toEqual(posts));
    expect(calls).toBe(1);
  });
});