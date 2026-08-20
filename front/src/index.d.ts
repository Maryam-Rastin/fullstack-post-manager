import type { PostActionTypes } from "./helper/constant";

type Post = {
  id: string;
  title: string;
  content: string;
};

type PostState = {
  posts: Post[];
  selectedPost: Post | null;
};

type PostAction =
  | {
      type: PostActionTypes.SET_POSTS;
      payload: Post[];
    }
  | {
      type: PostActionTypes.SET_SELECTED_POST;
      payload: Post;
    };