import Image from "next/image";

import { cn } from "@/lib/utils";
import { widgetsList } from "./widgets-list";

export const AddWidgetComponent = ({
  selectedWidgets,
  setSelectedWidgets,
}: {
  selectedWidgets: string[];
  setSelectedWidgets: (widgets: string[]) => void;
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {widgetsList.map((widget) => (
        <div
          key={widget.id}
          className={cn(
            "border-[1.5px] rounded-sm bg-sidebar p-3 overflow-hidden cursor-pointer shadow-sm",
            selectedWidgets.includes(widget.id)
              ? "border-primary"
              : "border-primary/20"
          )}
          onClick={() => {
            if (selectedWidgets.includes(widget.id)) {
              setSelectedWidgets(
                selectedWidgets.filter((id) => id !== widget.id)
              );
            } else {
              setSelectedWidgets([...selectedWidgets, widget.id]);
            }
          }}
        >
          <div className="flex flex-col gap-2 items-center justify-center w-fit h-full">
            <div className="relative h-[150px] w-full">
              <Image
                className="border"
                src={widget.image}
                alt={widget.name}
                fill
              />
            </div>
            <div className="px-2 py-1.5 flex flex-col gap-1">
              <p className="font-semibold text-primary/80">{widget.name}</p>
              <p className="text-xs text-primary/60">{widget.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
