import type { PostActionTypes } from "./helper/constant";

type Post = {
  id: string;
  title: string;
  content: string;
};

type PostState = {
  posts: Post[];
  selectedPost: Post;
};

type PostAction =
  | { type: typeof PostActionTypes.ADD_POST; payload: Post }
  | { type: typeof PostActionTypes.EDIT_POST; payload: Post }
  | { type: typeof PostActionTypes.DELETE_POST; payload: Post }
  | { type: typeof PostActionTypes.SET_POST; payload: Post }
  | { type: typeof PostActionTypes.SET_POSTS; payload: Post[] };

export type { Post, PostState, PostAction };