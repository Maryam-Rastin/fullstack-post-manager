import { describe, it, expect } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { Post } from "../..";
import PostProvider from "../../context/post";
import { server } from "../../test/server";
import List from "./List";

const API = "http://localhost:3001/api";

const posts: Post[] = [
  { id: "1", title: "First", content: "First content" },
  { id: "2", title: "Second", content: "Second content" },
];

const renderList = () =>
  render(
    <PostProvider>
      <List />
    </PostProvider>,
  );

describe("List", () => {
  it("shows the posts returned by the API", async () => {
    server.use(http.get(`${API}/post`, () => HttpResponse.json(posts)));

    renderList();

    expect(await screen.findByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second content")).toBeInTheDocument();
  });

  it("shows the empty message when the API returns no posts", async () => {
    let calls = 0;
    server.use(
      http.get(`${API}/post`, () => {
        calls++;
        return HttpResponse.json([]);
      }),
    );

    renderList();

    await waitFor(() => expect(calls).toBe(1));
    expect(await screen.findByText("No data to display")).toBeInTheDocument();
  });

  it("removes a post and calls the API when delete is clicked", async () => {
    let deleted = false;
    server.use(
      http.get(`${API}/post`, () => HttpResponse.json(posts)),
      http.delete(`${API}/post/1`, () => {
        deleted = true;
        return HttpResponse.json({
          message: "Post deleted successfully",
          id: "1",
        });
      }),
    );
    const user = userEvent.setup();

    renderList();

    const card = (await screen.findByText("First")).closest(
      ".card",
    ) as HTMLElement;
    // Each card has two icon buttons: edit first, delete second
    await user.click(within(card).getAllByRole("button")[1]);

    await waitFor(() => expect(deleted).toBe(true));
    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});