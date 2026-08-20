import React, { useContext, useEffect, type FC } from "react";
import PostItem from "./Item";
import { PostContext } from "../../context/post";
import { PostActionTypes } from "../../helper/constant";
import type { Post } from "../..";

const List: FC = () => {
  const { postState, query, dispatch } = useContext(PostContext)!;

  useEffect(() => {
    dispatch({
      type: PostActionTypes.SET_POSTS,
      payload: query.data as Post[],
    });
  }, [query.data, dispatch]);
  return (
    <div className="flex flex-col gap-3 mt-5">
      {postState?.posts?.length > 0 ? (
        postState.posts?.map((item) => <PostItem {...item} key={item.id} />)
      ) : (
        <span className="text-center text-lg font-bold">
          No data to display
        </span>
      )}
    </div>
  );
};

export default List;
