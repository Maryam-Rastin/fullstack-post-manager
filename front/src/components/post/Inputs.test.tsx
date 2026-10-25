import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import type { Post, PostState } from "../..";
import { PostContext } from "../../context/post";
import {
  HttpMethod,
  InitialPostState,
  PostActionTypes,
} from "../../helper/constant";
import Inputs from "./Inputs";

const { executeMock } = vi.hoisted(() => ({ executeMock: vi.fn() }));

// No real network calls: replace the mutation hook with a spy
vi.mock("../../hook/useMutation", () => ({
  default: () => ({ execute: executeMock }),
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn() },
}));

const dispatch = vi.fn();

// The kind of id Postgres generates
const SERVER_ID = "3f6c1a52-8d0e-4b7a-9c1d-2e5f7a8b9c01";

const renderInputs = (selectedPost: Post = InitialPostState.selectedPost) => {
  const postState: PostState = { posts: [], selectedPost };

  return render(
    <PostContext.Provider
      value={{
        postState,
        dispatch,
        query: {
          data: undefined,
          loading: false,
          error: undefined,
          refetch: vi.fn(),
        },
        search: "",
        setSearch: vi.fn(),
      }}
    >
      <Inputs />
    </PostContext.Provider>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  executeMock.mockReset();
});

describe("Inputs", () => {
  it("shows 'Create Post' when no post is selected", () => {
    renderInputs();
    expect(
      screen.getByRole("button", { name: "Create Post" }),
    ).toBeInTheDocument();
  });

  describe("adding a post", () => {
    it("sends title and content, then adds the post with the server's id", async () => {
      executeMock.mockResolvedValue({
        id: SERVER_ID,
        title: "My title",
        content: "My content",
      });
      const user = userEvent.setup();
      renderInputs();

      await user.type(screen.getByPlaceholderText("Post title"), "My title");
      await user.type(
        screen.getByPlaceholderText("Post content"),
        "My content",
      );
      await user.click(screen.getByRole("button", { name: "Create Post" }));

      await waitFor(() =>
        expect(dispatch).toHaveBeenCalledWith({
          type: PostActionTypes.ADD_POST,
          payload: { id: SERVER_ID, title: "My title", content: "My content" },
        }),
      );
      // The client no longer invents an id: only title and content are sent
      expect(executeMock).toHaveBeenCalledWith({
        url: "post",
        method: HttpMethod.POST,
        body: { title: "My title", content: "My content" },
      });
      await waitFor(() =>
        expect(screen.getByPlaceholderText("Post title")).toHaveValue(""),
      );
      expect(screen.getByPlaceholderText("Post content")).toHaveValue("");
    });

    it("does not add the post or clear the form when the request fails", async () => {
      // useMutation resolves with undefined when a request fails
      executeMock.mockResolvedValue(undefined);
      const user = userEvent.setup();
      renderInputs();

      await user.type(screen.getByPlaceholderText("Post title"), "My title");
      await user.type(
        screen.getByPlaceholderText("Post content"),
        "My content",
      );
      await user.click(screen.getByRole("button", { name: "Create Post" }));

      await waitFor(() => expect(executeMock).toHaveBeenCalled());
      // Let the async submit handler finish before checking what it did not do
      await act(async () => {});

      expect(dispatch).not.toHaveBeenCalled();
      expect(screen.getByPlaceholderText("Post title")).toHaveValue("My title");
      expect(screen.getByPlaceholderText("Post content")).toHaveValue(
        "My content",
      );
    });

    it("rejects a title shorter than 4 characters", async () => {
      const user = userEvent.setup();
      renderInputs();

      await user.type(screen.getByPlaceholderText("Post title"), "abc");
      await user.click(screen.getByRole("button", { name: "Create Post" }));

      expect(toast.error).toHaveBeenCalledWith(
        "Title must be at least 4 characters long",
      );
      expect(dispatch).not.toHaveBeenCalled();
      expect(executeMock).not.toHaveBeenCalled();
    });
  });

  describe("editing a post", () => {
    it("pre-fills the form and edits when a post is selected", async () => {
      const user = userEvent.setup();
      renderInputs({
        id: SERVER_ID,
        title: "Old title",
        content: "Old content",
      });

      expect(screen.getByPlaceholderText("Post title")).toHaveValue(
        "Old title",
      );
      expect(screen.getByPlaceholderText("Post content")).toHaveValue(
        "Old content",
      );

      await user.clear(screen.getByPlaceholderText("Post title"));
      await user.type(screen.getByPlaceholderText("Post title"), "New title");
      await user.click(screen.getByRole("button", { name: "Edit Post" }));

      expect(dispatch).toHaveBeenCalledWith({
        type: PostActionTypes.EDIT_POST,
        payload: { id: SERVER_ID, title: "New title", content: "Old content" },
      });
      expect(executeMock).toHaveBeenCalledWith({
        url: `post/${SERVER_ID}`,
        method: HttpMethod.PUT,
        body: { id: SERVER_ID, title: "New title", content: "Old content" },
      });
    });
  });
});
