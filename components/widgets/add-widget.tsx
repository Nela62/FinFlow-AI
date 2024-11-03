import Image from "next/image";

import { SheetContent } from "../ui/sheet";
import { useSidebarStore } from "@/providers/sidebarStoreProvider";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

const widgets = [
  {
    id: "metrics",
    name: "Metrics",
    image: "/widgets/metrics.png",
  },
  {
    id: "technical_analysis",
    name: "Technical Analysis",
    image: "/widgets/technical-analysis.png",
  },
  {
    id: "stock_screener",
    name: "Stock Screener",
    image: "/widgets/stock-screener.png",
  },
];

export const AddWidgetComponent = ({
  onComplete,
}: {
  onComplete: () => Promise<void>;
}) => {
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className={cn(
            "border rounded-md overflow-hidden",
            selectedWidgets.includes(widget.id)
              ? "border-primary"
              : "border-primary/40"
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
          <div className="flex flex-col items-center justify-center">
            <Image
              className="border-b border-primary/40 object-contain"
              src={widget.image}
              alt={widget.name}
              height={120}
              width={200}
            />
            <p className="text-sm font-semibold py-1.5 text-primary/80">
              {widget.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
