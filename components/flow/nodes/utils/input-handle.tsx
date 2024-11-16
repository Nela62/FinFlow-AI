import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { dataTypesList, NodeInput } from "@/types/node";
import { Handle, Position } from "@xyflow/react";
import { CircleHelp, File } from "lucide-react";
import { Fragment, useMemo } from "react";

// TODO: add handle id
export const InputHandle = ({
  input,
  index,
  totalHandles,
}: {
  input: NodeInput;
  index: number;
  totalHandles: number;
}) => {
  return (
    <div className="relative">
      <div
        className="absolute -translate-x-1/2 z-10 flex flex-col gap-1 items-center -top-9 -translate-y-1/2"
        style={{ left: `${(index + 1) * (100 / (totalHandles + 1))}%` }}
      >
        <Tooltip>
          <TooltipTrigger>
            <div className="flex gap-1 bg-background rounded-md px-2 py-0.5 items-center">
              {/* <File className="h-2 w-2 text-muted-foreground" /> */}
              <p className="text-xs text-muted-foreground">
                {input.acceptedFormat}
              </p>
              <CircleHelp className="h-2 w-2 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="shadow-sm">
            <div className="flex">
              <p>Accepted formats: </p>
              {input.acceptedTypes.map((type, i) => (
                <Fragment key={type}>
                  <p className="font-semibold pl-1">{type}</p>
                  {i !== input.acceptedTypes.length - 1 && <p>, </p>}
                </Fragment>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>

        <div className="bg-muted rounded-md px-2 py-0.5">
          <p className="text-sm text-muted-foreground font-semibold">
            {input.label}
          </p>
        </div>
      </div>

      <Handle
        id={`handle-${input.label}`}
        style={{
          height: "16px",
          width: "16px",
          left: `${(index + 1) * (100 / (totalHandles + 1))}%`,
          transform: "translateX(-50%) translateY(-50%)",
          backgroundColor: "white",
          border: "2px solid #6b7280",
          zIndex: 10,
        }}
        type="target"
        position={Position.Top}
      />
    </div>
  );
};
