import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

// SortableItem component
const SortableItem = ({
  id,
  title,
  position,
}: {
  id: string;
  title: string;
  position: number;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-4 py-1 mb-2 bg-white rounded-lg border border-gray-200"
    >
      <span className="text-gray-500 w-2">{position}</span>
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:bg-gray-100 p-1 rounded"
      >
        <GripVertical className="text-gray-400" size={20} />
      </div>
      <span className="text-gray-600">{title}</span>
    </div>
  );
};

export type Item = { id: string; title: string };

const SortableList = ({ items: defaultItems }: { items: Item[] }) => {
  const [items, setItems] = useState(defaultItems);

  useEffect(() => {
    setItems(defaultItems);
  }, [defaultItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active?.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto nodrag">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item, i) => (
            <SortableItem
              key={item.id}
              id={item.id}
              title={item.title}
              position={i + 1}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SortableList;
