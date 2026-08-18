import React, {
  createContext,
  useReducer,
  type Dispatch,
  type FC,
} from "react";
import { PostReducer } from "../../reducers/post";
import { InitialPostState } from "../../helper/constant";
import type { PostAction, PostState } from "../..";

type ProviderProps = {
  children: React.ReactNode;
};

export const PostContext = createContext<{
  postState: PostState;
  dispatch: Dispatch<PostAction>;
} | null>(null);

const PostProvider: FC<ProviderProps> = (props) => {
  const [postState, dispatch] = useReducer(PostReducer, InitialPostState);

  const value = { postState, dispatch };

  return (
    <>
      <PostContext.Provider value={value}>
        {props.children}
      </PostContext.Provider>
      ;
    </>
  );
};

export default PostProvider;
