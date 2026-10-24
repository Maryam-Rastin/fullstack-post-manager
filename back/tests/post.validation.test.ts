import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/index";
import { db } from "../src/db";

vi.mock("../src/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    query: { posts: { findFirst: vi.fn() } },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("request validation", () => {
  it("POST rejects a title longer than 256 characters", async () => {
    const res = await request(app)
      .post("/api/post")
      .send({ title: "a".repeat(257), content: "text" });

    expect(res.status).toBe(400);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("POST rejects an empty body and never touches the database", async () => {
    const res = await request(app).post("/api/post").send({});

    expect(res.status).toBe(400);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("POST rejects a title of the wrong type", async () => {
    const res = await request(app)
      .post("/api/post")
      .send({ title: 123, content: "text" });

    expect(res.status).toBe(400);
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("PUT rejects an empty body and never touches the database", async () => {
    const res = await request(app).put("/api/post/1").send({});

    expect(res.status).toBe(400);
    expect(db.update).not.toHaveBeenCalled();
  });
});
