import type { PostActionTypes } from "./helper/constant";

type Post = {
  id: string;
  title: string;
  content: string;
};

type PostState={
  posts:Post[]
  selectedPost:Post
}

type PostAction = {
  type: PostActionTypes
  payload: Post;
};
