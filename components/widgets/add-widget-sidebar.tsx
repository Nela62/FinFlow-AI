import Image from "next/image";

import { SheetContent } from "../ui/sheet";
import { useSidebarStore } from "@/providers/sidebarStoreProvider";

const widgets = [
  {
    id: "metrics",
    name: "Metrics",
    type: "metrics",
    image: "/metrics.png",
  },
];

export const AddWidgetDrawer = () => {
  const { setIsAddWidgetOpen, setDraggedWidgetType } = useSidebarStore(
    (state) => state
  );

  return (
    <SheetContent
      side="right"
      className="bg-transparent outline-none w-[310px] flex border-none p-2"
      // The gap between the edge of the screen and the drawer is 8px in this case.
      style={
        { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
      }
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <div className="bg-zinc-50 h-full w-full grow p-5 flex flex-col rounded-[16px]">
        <div className="w-full pt-4">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="relative w-full h-40 droppable-element cursor-grab"
              draggable={true}
              unselectable="on"
              // this is a hack for firefox
              // Firefox requires some kind of initialization
              // which we can do by adding this attribute
              // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", "");
                setIsAddWidgetOpen(false);
                setDraggedWidgetType(widget.type);
              }}
            >
              <Image
                src={widget.image}
                alt={widget.name}
                className="w-full h-auto"
                fill
              />
              <p className="absolute bottom-2 left-2 font-semibold">
                {widget.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SheetContent>
  );
};
