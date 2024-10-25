import { useSortable } from "@dnd-kit/sortable";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CSS } from "@dnd-kit/utilities";

export type SortableWidgetProps = {
  id: string;
  children: React.ReactNode;
  defaultHeight?: number;
  defaultSize?: number;
  className?: string;
};

export const SortableWidget = ({
  id,
  children,
  defaultHeight = 300,
  defaultSize = 100,
  className,
}: SortableWidgetProps) => {
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
    height: defaultHeight,
    width: `${defaultSize}%`,
    // width: "100%",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className={cn(
          "h-full w-full bg-slate-800 border-slate-700",
          isDragging && "ring-2 ring-primary ring-offset-2",
          className
        )}
      >
        {children}
      </Card>
    </div>
  );
};
