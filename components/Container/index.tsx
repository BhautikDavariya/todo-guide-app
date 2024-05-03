import React from "react";
import ContainerProps from "./container.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "../Button";
import { Delete, GripVertical, Trash } from "lucide-react";

const Container = ({
  id,
  children,
  title,
  containers,
  description,
  onAddItem,
  deleteContainer,
}: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "container",
    },
  });
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "w-full h-full p-4 bg-gray-50 rounded-xl  flex flex-col gap-y-4 border",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-gray-800 text-xl">{title}</h1>
            {id.toString().includes("container-new") && (
              <button
                className=" p-1 text-xs  "
                // {...listeners}
                onClick={deleteContainer}
              >
                <Trash className="h-7 w-7 text-red-500  border rounded-full p-1 border-red-600" />
              </button>
            )}
          </div>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        {/* <button
          className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
          {...listeners}
        >
          Drag Handle
        </button> */}
      </div>

      {children}
      {containers && containers[0]?.id === id && (
        <Button
          variant="ghost"
          onClick={onAddItem}
          className="border border-slate-200"
        >
          Add Task
        </Button>
      )}
    </div>
  );
};

export default Container;
