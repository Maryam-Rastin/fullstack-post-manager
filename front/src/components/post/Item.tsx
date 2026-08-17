import React, { type FC } from "react";
import { EditIcon } from "../../icons/EditIcon";
import { DeleteIcon } from "../../icons/DeleteIcon";
const Item: FC = () => {
  const onclickEdit = () => console.log("Edit");
  const onclickDelete = () => console.log("Delete");

  return (
    <div>
      <div className="card card-compact w-full bg-base-100 shadow-xl duration-75 hover:scale-105">
        <div className="card-body">
          <div className="card-title flex justify-between items-center">
            <h2>title</h2>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-circle btn-outline btn-sm"
                onClick={onclickEdit}
              >
                <EditIcon />
              </button>
              <button
                className="btn btn-circle btn-outline btn-sm"
                onClick={onclickDelete}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
          <p>Content</p>
        </div>
      </div>
    </div>
  );
};
export default Item;
