import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Eye, FilePenLine, GripVertical, Trash2 } from "lucide-react";

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  description?: string;
  handleEditData?: any;
  borderColors?: string;
  handleItemsDelete?: () => any;
  handlePreviewData?: () => void;
};

const Items = ({
  id,
  title,
  description,
  handlePreviewData,
  handleEditData,
  borderColors,
  handleItemsDelete,
}: ItemsType) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,

    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "item",
    },
  });
  console.log("borderColors",borderColors)
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        `px-2 py-4 bg-white shadow-md rounded-xl ${borderColors} w-full border  hover:${borderColors} cursor-pointer`,
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="line-clamp-1 font-semibold">{title}</span>
        <div className="flex stify-center items-center space-x-1">
          <div className="a flex justify-center items-center space-x-2">
            <Eye
              className="h-6 w-6 text-green-500"
              onClick={handlePreviewData}
            />
            <FilePenLine
              className="h-5 w-5 text-blue-500"
              onClick={() => handleEditData(id)}
            />
            <Trash2
              className="h-5 w-5 text-red-500"
              onClick={handleItemsDelete}
            />
          </div>
          <button className=" p-1 text-xs" {...listeners}>
            <GripVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="text-sm line-clamp-2">{description}</div>
    </div>
  );
};

export default Items;
