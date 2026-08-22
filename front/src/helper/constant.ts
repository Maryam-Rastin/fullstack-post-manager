import type { PostState } from "..";

export const PostActionTypes = {
  ADD_POST: "ADD_POST",
  EDIT_POST: "EDIT_POST",
  DELETE_POST: "DELETE_POST",
  GET_POST: "GET_POST",
  SET_POST: "SET_POST",
  SET_POSTS: "SET_POSTS",
} as const;

export const HttpMethod = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
} as const;

export const InitialPostState: PostState = {
  selectedPost: { id: "", title: "", content: "" },
  posts: [{ id: "1", title: "test", content: "test" }],
};
