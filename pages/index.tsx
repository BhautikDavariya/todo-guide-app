import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// DnD
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { Inter } from "next/font/google";

// Components
import Container from "@/components/Container";
import Items from "@/components/Item";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import TextArea from "@/components/textarea";
import { setInterval } from "timers/promises";

const inter = Inter({ subsets: ["latin"] });

export type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    title: string;
    description: string;
  }[];
};

export default function Home() {
  const [containers, setContainers] = useState<DNDType[]>([
    {
      id: `container-${uuidv4()}`,
      title: "Initial Task",
      items: [],
    },
    {
      id: `container-${uuidv4()}`,
      title: "Pending Task",
      items: [],
    },
    {
      id: `container-${uuidv4()}`,
      title: "Testing Task",
      items: [],
    },
    {
      id: `container-${uuidv4()}`,
      title: "Complete Task",
      items: [],
    },
  ]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>();
  const [currentItemId, setCurrentItemId] = useState<UniqueIdentifier>();
  const [containerName, setContainerName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [previewData, setPreviewData] = useState(false);
  const [editData, setEditData] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const borderColors = [
    "border-slate-600",
    "border-blue-600",
    "border-yellow-600",
    "border-green-600",
  ];

  useEffect(() => {
    const localValues = localStorage.getItem("containers");
    if (localValues) {
      setContainers(JSON.parse(localValues));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("containers", JSON.stringify(containers));
  }, [containers]);

  // useEffect(() => {
  //   localStorage.setItem("firstTime", JSON.stringify(true));
  //   const localValue = localStorage.getItem("firstTime")?.toString() ?? "";
  //   const firstTime = JSON.parse(localValue) || false;
  //   firstTime && localStorage.setItem("containers", JSON.stringify(containers));
  //   setFirstTime(false);
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("containers", JSON.stringify(containers));
  // }, [containers]);

  useEffect(() => {
    if (!showAddItemModal) {
      setShowAddItemModal(false);
      setItemName("");
      setItemDescription("");
      setPreviewData(false);
      setEditData(false);
    }
  }, [showAddItemModal]);

  const onAddContainer = () => {
    if (!containerName) return;
    const id = `container-new-${uuidv4()}`;
    // const localContainers = localStorage?.getItem("containers") || null;
    // if (localContainers && localContainers !== null) {
    //   const beforeSettingContainers = JSON.parse(localContainers);
    //   setContainers([
    //     ...beforeSettingContainers,
    //     { id, title: containerName, items: [] },
    //   ]);
    // }
    setContainers([
      ...containers,
      {
        id,
        title: containerName,
        items: [],
      },
    ]);
    setContainerName("");
    setShowAddContainerModal(false);
  };

  const onDeleteContainer = (id: UniqueIdentifier) => {
    handleSetContainerId(id);
    const newContainers = containers.filter((container) => container.id !== id);
    setContainers(newContainers);
  };

  const onAddItem = () => {
    if (!itemName || !itemDescription) return;
    const id = `item-${uuidv4()}`;
    const container = containers.find((item) => item.id === currentContainerId);
    if (!container) return;
    container.items.push({
      id,
      title: itemName,
      description: itemDescription,
    });
    setContainers([...containers]);
    setItemName("");
    setItemDescription("");
    setShowAddItemModal(false);
  };
  const onUpdateItem = (id: UniqueIdentifier | undefined) => {
    if (!itemName || !itemDescription) return;
    const container = containers.find((item) => item.id === currentContainerId);
    if (!container) return;
    const itemIndex = container.items.findIndex((item) => item.id === id);
    container.items[itemIndex].title = itemName;
    container.items[itemIndex].description = itemDescription;
    setContainers([...containers]);
    setItemName("");
    setItemDescription("");
    setShowAddItemModal(false);
  };

  const handleItemsDelete = () => {
    const container = containers.find((item) => item.id === currentContainerId);
    if (!container) return;
    const newItems = container.items.filter(
      (item) => item.id !== currentItemId
    );
    container.items = newItems;
    setContainers([...containers]);
  };

  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === "container") {
      return containers.find((item) => item.id === id);
    }
    if (type === "item") {
      return containers.find((container) =>
        container.items.find((item) => item.id === id)
      );
    }
  }

  const findItemTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "item");
    if (!container) return "";
    const item = container.items.find((item) => item.id === id);
    if (!item) return "";
    return item.title;
  };
  const findItemDescription = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "item");
    if (!container) return "";
    const item = container.items.find((item) => item.id === id);
    if (!item) return "";
    return item.description;
  };

  const handlePreviewData = () => {
    setShowAddItemModal(true);
    const currentContainerItems = findContainerItems(currentContainerId);
    setItemName(currentContainerItems[0]?.title);
    setItemDescription(currentContainerItems[0]?.description);
    setPreviewData(true);
  };
  const handleEditData = (id: UniqueIdentifier) => {
    setShowAddItemModal(true);
    const currentContainerItems = findContainerItems(currentContainerId);
    setItemName(currentContainerItems[0]?.title);
    setItemDescription(currentContainerItems[0]?.description);
    setEditData(true);
    setCurrentItemId(id);
  };

  const findContainerTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return "";
    return container.title;
  };

  const findContainerItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return [];
    return container.items;
  };

  const handleSetContainerId = (id: UniqueIdentifier | undefined) => {
    setCurrentContainerId(id);
  };

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    // Handle Items Sorting
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id
      );
      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex
        );

        setContainers(newItems);
      } else {
        // In different containers
        let newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem
        );
        setContainers(newItems);
      }
    }

    // Handling Item Drop Into a Container
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );

      // Remove the active item from the active container and add it to the over container
      let newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].items.push(removeditem);
      setContainers(newItems);
    }
  };

  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Handling Container Sorting
    if (
      active.id.toString().includes("container") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === active.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === over.id
      );
      // Swap the active and over container
      let newItems = [...containers];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      setContainers(newItems);
    }

    // Handling item Sorting
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id
      );

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex
        );
        setContainers(newItems);
      } else {
        // In different containers
        let newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem
        );
        setContainers(newItems);
      }
    }
    // Handling item dropping into Container
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );

      let newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].items.push(removeditem);
      setContainers(newItems);
    }
    setActiveId(null);
  }

  console.log("container", { currentContainerId, containers });

  return (
    <div className="mx-auto max-w-[100rem] py-10 px-5">
      {/* Add Container Modal */}
      <Modal
        showModal={showAddContainerModal}
        setShowModal={setShowAddContainerModal}
      >
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-gray-800 text-3xl font-bold">Add TaskTracker</h1>
          <Input
            type="text"
            placeholder="Container Title"
            name="containername"
            value={containerName}
            onChange={(e) => setContainerName(e.target.value)}
          />
          <Button onClick={onAddContainer}>Save</Button>
        </div>
      </Modal>
      {/* Add Item Modal */}
      <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-gray-800 text-3xl font-bold">Add Items</h1>
          <Input
            type="text"
            readOnly={previewData}
            placeholder="Item Title"
            name="itemname"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <TextArea
            type="text"
            placeholder="Item Description"
            readOnly={previewData}
            name="itemDescription"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />

          {editData ? (
            <Button onClick={() => onUpdateItem(currentItemId)}>
              Save
            </Button>
          ) : (
            !previewData && <Button onClick={onAddItem}>Save</Button>
          )}
        </div>
      </Modal>
      <div className="flex items-center justify-between gap-y-2">
        <h1 className="text-gray-800 md:text-3xl text-lg font-bold select-none cursor-pointer">
          TaskTracker
        </h1>
        <Button
          onClick={() => setShowAddContainerModal(true)}
          className="text-xs md:text-base"
        >
          Add TaskTracker
        </Button>
      </div>
      <div className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={containers.map((i) => i.id)}>
              {containers.map((container, index) => {
                return (
                  <>
                    <Container
                      id={container.id}
                      title={container.title}
                      containers={containers}
                      key={container.id}
                      deleteContainer={() => onDeleteContainer(container.id)}
                      onAddItem={() => {
                        setShowAddItemModal(true);
                        setCurrentContainerId(container.id);
                      }}
                    >
                      <SortableContext items={container.items.map((i) => i.id)}>
                        <div className="flex items-start flex-col gap-y-4">
                          {container.items.map((i) => (
                            <Items
                              title={i.title}
                              id={i.id}
                              key={i?.id}
                              borderColors={borderColors[index]}
                              description={i?.description}
                              handlePreviewData={handlePreviewData}
                              handleEditData={handleEditData}
                              handleItemsDelete={handleItemsDelete}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </Container>
                  </>
                );
              })}
            </SortableContext>
            <DragOverlay adjustScale={false}>
              {/* Drag Overlay For item Item */}
              {activeId && activeId.toString().includes("item") && (
                <Items
                  id={activeId}
                  title={findItemTitle(activeId)}
                  description={findItemDescription(activeId)}
                  handlePreviewData={handlePreviewData}
                  handleEditData={handleEditData}
                  // borderColors={borderColors[index]}
                  handleItemsDelete={handleItemsDelete}
                />
              )}
              {/* Drag Overlay For Container */}
              {activeId && activeId.toString().includes("container") && (
                <Container id={activeId} title={findContainerTitle(activeId)}>
                  {findContainerItems(activeId).map((i, index) => (
                    <Items
                      key={i.id}
                      title={i.title}
                      id={i.id}
                      description={i?.description}
                      handlePreviewData={handlePreviewData}
                      // borderColors={borderColors[index]}
                      handleEditData={handleEditData}
                      handleItemsDelete={handleItemsDelete}
                    />
                  ))}
                </Container>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
