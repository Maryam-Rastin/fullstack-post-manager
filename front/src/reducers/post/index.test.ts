import { describe, it, expect } from "vitest";
import type { Post, PostAction, PostState } from "../..";
import { InitialPostState, PostActionTypes } from "../../helper/constant";
import { PostReducer } from "./index";

const postA: Post = { id: "a", title: "First", content: "First content" };
const postB: Post = { id: "b", title: "Second", content: "Second content" };

const emptySelected = InitialPostState.selectedPost;

// A state we control, with a selected post so we can check it gets reset
const makeState = (): PostState => ({
  posts: [postA, postB],
  selectedPost: postA,
});

describe("PostReducer", () => {
  describe("ADD_POST", () => {
    it("appends the new post and resets selectedPost", () => {
      const newPost: Post = { id: "c", title: "Third", content: "Third content" };

      const next = PostReducer(makeState(), {
        type: PostActionTypes.ADD_POST,
        payload: newPost,
      });

      expect(next.posts).toEqual([postA, postB, newPost]);
      expect(next.selectedPost).toEqual(emptySelected);
    });

    it("does not mutate the previous state", () => {
      const state = makeState();
      const snapshot = JSON.parse(JSON.stringify(state));

      PostReducer(state, {
        type: PostActionTypes.ADD_POST,
        payload: { id: "c", title: "Third", content: "Third content" },
      });

      expect(state).toEqual(snapshot);
    });
  });

  describe("EDIT_POST", () => {
    it("updates only the post with the matching id", () => {
      const edited: Post = { id: "a", title: "Edited", content: "New content" };

      const next = PostReducer(makeState(), {
        type: PostActionTypes.EDIT_POST,
        payload: edited,
      });

      expect(next.posts).toEqual([edited, postB]);
      expect(next.selectedPost).toEqual(emptySelected);
    });

    it("leaves the list unchanged when the id does not exist", () => {
      const next = PostReducer(makeState(), {
        type: PostActionTypes.EDIT_POST,
        payload: { id: "missing", title: "X", content: "Y" },
      });

      expect(next.posts).toEqual([postA, postB]);
    });
  });

  describe("DELETE_POST", () => {
    it("removes the post with the matching id", () => {
      const next = PostReducer(makeState(), {
        type: PostActionTypes.DELETE_POST,
        payload: postA,
      });

      expect(next.posts).toEqual([postB]);
      expect(next.selectedPost).toEqual(emptySelected);
    });

    it("leaves the list unchanged when the id does not exist", () => {
      const next = PostReducer(makeState(), {
        type: PostActionTypes.DELETE_POST,
        payload: { id: "missing", title: "", content: "" },
      });

      expect(next.posts).toEqual([postA, postB]);
    });
  });

  describe("SET_POST", () => {
    it("sets selectedPost and keeps the posts list", () => {
      const next = PostReducer(makeState(), {
        type: PostActionTypes.SET_POST,
        payload: postB,
      });

      expect(next.selectedPost).toEqual(postB);
      expect(next.posts).toEqual([postA, postB]);
    });
  });

  describe("SET_POSTS", () => {
    it("replaces the whole list and resets selectedPost", () => {
      const next = PostReducer(makeState(), {
        type: PostActionTypes.SET_POSTS,
        payload: [postB],
      });

      expect(next.posts).toEqual([postB]);
      expect(next.selectedPost).toEqual(emptySelected);
    });

    it("can set an empty list", () => {
      const next = PostReducer(makeState(), {
        type: PostActionTypes.SET_POSTS,
        payload: [],
      });

      expect(next.posts).toEqual([]);
    });
  });

  describe("unknown action", () => {
    it("returns the same state object", () => {
      const state = makeState();
      const unknownAction = { type: "SOMETHING_ELSE" } as unknown as PostAction;

      expect(PostReducer(state, unknownAction)).toBe(state);
    });
  });
});