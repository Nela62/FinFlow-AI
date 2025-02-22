import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { NodeHeaderStyle } from "@/types/node";
import { Checkbox } from "@/components/ui/checkbox";

export const NodeHeader = ({
  title,
  bgColor,
  textColor,
  visual,
}: NodeHeaderStyle) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "flex justify-between rounded-md p-2 mb-4 w-full items-center",
          bgColor,
          textColor
        )}
      >
        <div className={cn("flex items-center gap-4")}>
          {visual.type === "image" ? (
            <Image
              src={visual.image}
              alt="Node Image"
              className="rounded-md"
              width={60}
              height={60}
            />
          ) : (
            <div
              className={cn(
                "rounded-md p-3 w-[60px] h-[60px] shadow-sm",
                visual.bgColor
              )}
            >
              <visual.Icon className="w-full h-full text-white" />
            </div>
          )}
          <p className="font-semibold text-lg">{title}</p>
        </div>
        <div className="text-xs flex items-center gap-2">
          <Checkbox />
          <div>
            <p className="font-medium">For each</p>
            <p className="font-medium">mode</p>
          </div>
        </div>
      </div>
    </div>
  );
};
