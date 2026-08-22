import React, { useContext, type FC } from "react";
import { EditIcon } from "../../icons/EditIcon";
import { DeleteIcon } from "../../icons/DeleteIcon";
import type { Post } from "../..";
import { PostContext } from "../../context/post";
import { HttpMethod, PostActionTypes } from "../../helper/constant";
import useMutation from "../../hook/useMutation";

const Item: FC<Post> = (post) => {
  const { id, title, content } = post;
  const { dispatch } = useContext(PostContext)!;
  const { execute } = useMutation();

  const onclickEdit = (post: Post) => {
    console.log("Edit", post);
    dispatch({ type: PostActionTypes.SET_POST, payload: post });
  };
  const onclickDelete = (id: string) => {
    console.log("Delete", id);
    dispatch({ type: PostActionTypes.DELETE_POST, payload: post });
    execute({ url: `post/${id}`, method: HttpMethod.DELETE });
  };

  return (
    <div>
      <div className="card card-compact w-full bg-base-100 shadow-xl duration-75 hover:scale-105">
        <div className="card-body">
          <div className="card-title flex justify-between items-center">
            <h2>{title}</h2>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-circle btn-outline btn-sm"
                onClick={() => onclickEdit(post)}
              >
                <EditIcon />
              </button>
              <button
                className="btn btn-circle btn-outline btn-sm"
                onClick={() => onclickDelete(id)}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};
export default Item;
