import { describe, it, expect } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { Post } from "..";
import { HttpMethod } from "../helper/constant";
import { server } from "../test/server";
import useMutation from "./useMutation";

const API = "http://localhost:3001/api";

const post: Post = { id: "1", title: "Hello", content: "World" };

describe("useMutation", () => {
  it("sends a POST with the body and stores the response", async () => {
    let received: unknown;
    server.use(
      http.post(`${API}/post`, async ({ request }) => {
        received = await request.json();
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

    await waitFor(() => expect(result.current.data).toEqual(post));
    expect(received).toEqual(post);
  });

  it("sends a PUT to the post's url with the body", async () => {
    const edited: Post = { id: "1", title: "New", content: "Text" };
    let received: unknown;
    server.use(
      http.put(`${API}/post/1`, async ({ request }) => {
        received = await request.json();
        return HttpResponse.json(edited);
      }),
    );

    const { result } = renderHook(() => useMutation<Post>());

    act(() => {
      result.current.execute({
        url: "post/1",
        method: HttpMethod.PUT,
        body: edited,
      });
    });

    await waitFor(() => expect(result.current.data).toEqual(edited));
    expect(received).toEqual(edited);
  });

  it("sends a DELETE and stores the response", async () => {
    const response = { message: "Post deleted successfully", id: "1" };
    server.use(http.delete(`${API}/post/1`, () => HttpResponse.json(response)));

    const { result } = renderHook(() =>
      useMutation<{ message: string; id: string }>(),
    );

    act(() => {
      result.current.execute({ url: "post/1", method: HttpMethod.DELETE });
    });

    await waitFor(() => expect(result.current.data).toEqual(response));
  });
});