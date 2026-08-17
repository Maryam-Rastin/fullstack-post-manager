import type { Post, PostAction, PostState } from "../..";
import { InitialPostState, PostActionTypes } from "../../helper/constant";

export const PostReducer = (state: PostState, action: PostAction) => {
  switch (action.type) {
    case PostActionTypes.ADD_POST: {
      const { id, title, content } = action.payload as Post;

      return {
        selectedPost: InitialPostState.selectedPost,
        posts: [
          ...state.posts,
          {
            id,
            title,
            content,
          },
        ],
      };
    }

    case PostActionTypes.EDIT_POST: {
      const { id, title, content } = action.payload as Post;

      return {
        selectedPost: InitialPostState.selectedPost,
        posts: state.posts.map((post) => {
          if (post.id === id) {
            return {
              id,
              title,
              content,
            };
          }

          return post;
        }),
      };
    }

    case PostActionTypes.DELETE_POST: {
      const id = action.payload;

      return {
        selectedPost: InitialPostState.selectedPost,
        posts: [...state.posts.filter((post) => post.id == id?.toString())],
      };
    }

    case PostActionTypes.SET_POST: {
      return { ...state, selectedPost: action.payload };
    }
    case PostActionTypes.SET_POSTS: {
      return {
        selectedPost: InitialPostState.selectedPost,
        posts: action.payload,
      };
    }
    default:
      const otheraction = action.type;
      return otheraction;
  }
};
