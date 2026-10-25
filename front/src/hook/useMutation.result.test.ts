import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { Post } from "..";
import { HttpMethod } from "../helper/constant";
import { server } from "../test/server";
import useMutation from "./useMutation";

const API = "http://localhost:3001/api";

const created: Post = {
  id: "3f6c1a52-8d0e-4b7a-9c1d-2e5f7a8b9c01",
  title: "Hello",
  content: "World",
};

describe("useMutation return value", () => {
  it("resolves with the response data", async () => {
    server.use(http.post(`${API}/post`, () => HttpResponse.json(created)));

    const { result } = renderHook(() => useMutation<Post>());
    let returned: Post | undefined;

    await act(async () => {
      returned = await result.current.execute({
        url: "post",
        method: HttpMethod.POST,
        body: { title: "Hello", content: "World" },
      });
    });

    expect(returned).toEqual(created);
  });

  it("resolves with undefined when the request fails", async () => {
    server.use(
      http.post(`${API}/post`, () =>
        HttpResponse.json({ message: "boom" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useMutation<Post>());
    let returned: Post | undefined = created;

    await act(async () => {
      returned = await result.current.execute({
        url: "post",
        method: HttpMethod.POST,
        body: { title: "Hello", content: "World" },
      });
    });

    expect(returned).toBeUndefined();
  });
});
