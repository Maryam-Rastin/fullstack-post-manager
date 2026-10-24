import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/index";
import type { Post } from "../src/db/schema";
import {
  getPostsService,
  getPostService,
  addPostService,
  editPostService,
  deletePostService,
} from "../src/services/post";

vi.mock("../src/services/post", () => ({
  getPostsService: vi.fn(),
  getPostService: vi.fn(),
  addPostService: vi.fn(),
  editPostService: vi.fn(),
  deletePostService: vi.fn(),
}));

// Real shape, with a Date. Use this for anything passed to a mock.
const post: Post = {
  id: "1",
  title: "Hello",
  content: "World",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
};

// What the API actually sends back: the Date becomes a string.
// Use this only when comparing against res.body.
const toJson = (value: unknown) => JSON.parse(JSON.stringify(value));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("GET /api/post", () => {
  it("returns the list of posts", async () => {
    vi.mocked(getPostsService).mockResolvedValue([post]);

    const res = await request(app).get("/api/post");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(toJson([post]));
    expect(getPostsService).toHaveBeenCalledWith(undefined);
  });

  it("passes the search query to the service", async () => {
    vi.mocked(getPostsService).mockResolvedValue([]);

    await request(app).get("/api/post?search=hel");

    expect(getPostsService).toHaveBeenCalledWith("hel");
  });

  it("returns 400 when the service throws", async () => {
    vi.mocked(getPostsService).mockRejectedValue(new Error("db down"));

    const res = await request(app).get("/api/post");

    expect(res.status).toBe(400);
  });
});

describe("GET /api/post/:id", () => {
  it("returns the post when it exists", async () => {
    vi.mocked(getPostService).mockResolvedValue(post);

    const res = await request(app).get("/api/post/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(toJson(post));
    expect(getPostService).toHaveBeenCalledWith("1");
  });

  it("returns 404 when the post does not exist", async () => {
    vi.mocked(getPostService).mockResolvedValue(undefined);

    const res = await request(app).get("/api/post/nope");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "post does not exist" });
  });
});

describe("POST /api/post", () => {
  it("creates a post from title and content", async () => {
    vi.mocked(addPostService).mockResolvedValue(post);

    const res = await request(app)
      .post("/api/post")
      .send({ title: "Hello", content: "World", ignored: "extra" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(toJson(post));
    // The controller only forwards title and content
    expect(addPostService).toHaveBeenCalledWith({
      title: "Hello",
      content: "World",
    });
  });

  it("returns 400 when the service throws", async () => {
    vi.mocked(addPostService).mockRejectedValue(new Error("invalid"));

    const res = await request(app)
      .post("/api/post")
      .send({ title: "x", content: "y" });

    expect(res.status).toBe(400);
  });
});

describe("PUT /api/post/:id", () => {
  it("updates the post", async () => {
    const edited: Post = { ...post, title: "New", content: "Text" };
    vi.mocked(editPostService).mockResolvedValue(edited);

    const res = await request(app)
      .put("/api/post/1")
      .send({ title: "New", content: "Text" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(toJson(edited));
    expect(editPostService).toHaveBeenCalledWith("1", {
      title: "New",
      content: "Text",
    });
  });

  it("returns 404 when the post does not exist", async () => {
    vi.mocked(editPostService).mockResolvedValue(undefined);

    const res = await request(app)
      .put("/api/post/nope")
      .send({ title: "New", content: "Text" });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "post does not exist" });
  });
});

describe("DELETE /api/post/:id", () => {
  it("deletes the post and returns its id", async () => {
    vi.mocked(deletePostService).mockResolvedValue("1");

    const res = await request(app).delete("/api/post/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Post deleted successfully", id: "1" });
  });

  it("returns 404 when the post does not exist", async () => {
    vi.mocked(deletePostService).mockResolvedValue(undefined);

    const res = await request(app).delete("/api/post/nope");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Post does not exist" });
  });
});