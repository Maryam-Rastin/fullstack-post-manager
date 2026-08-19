import React, {
  createContext,
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import { PostReducer } from "../../reducers/post";
import { InitialPostState } from "../../helper/constant";
import type { Post, PostAction, PostState } from "../..";
import useQuery from "../../hook/useQuery";

type ProviderProps = {
  children: React.ReactNode;
};

export const PostContext = createContext<{
  postState: PostState;
  dispatch: Dispatch<PostAction>;
  query: ReturnType<typeof useQuery>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
} | null>(null);

const PostProvider: FC<ProviderProps> = ({ children }) => {
  const [postState, dispatch] = useReducer(PostReducer, InitialPostState);
  const [search, setSearch] = useState("");
  const [queryUrl, setQueryUrl] = useState("post");

  const query = useQuery<Post[]>(queryUrl);

  useEffect(() => {
    if (search.length) {
      setQueryUrl(`post?search=${search}`);
    } else {
      setQueryUrl("post");
    }
  }, [search]);

  const value = {
    postState,
    dispatch,
    query,
    search,
    setSearch,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export default PostProvider;
