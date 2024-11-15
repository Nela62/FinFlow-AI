import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { dataTypesList, NodeInput } from "@/types/node";
import { Handle, Position } from "@xyflow/react";
import { CircleHelp, File } from "lucide-react";
import { Fragment, useMemo } from "react";

// TODO: add handle id
export const DefaultHandle = ({
  input,
  type,
  position,
}: {
  input: NodeInput;
  type: "target" | "source";
  position: Position;
}) => {
  const dataTypes = useMemo(
    () =>
      Array.from(
        new Set(
          input.acceptedFormats.flatMap((type) =>
            dataTypesList
              .filter((item) => item.formats.includes(type))
              .map((item) => item.name)
          )
        )
      ),
    [input.acceptedFormats]
  );

  return (
    <div className="relative">
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 z-10 flex flex-col gap-1 items-center",
          type === "target"
            ? "-top-9 -translate-y-1/2"
            : "bottom-9 translate-y-1/2"
        )}
      >
        {type === "target" && (
          <Tooltip>
            <TooltipTrigger>
              <div className="flex gap-1 bg-background rounded-md px-2 py-0.5 items-center">
                <File className="h-2 w-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Text</p>
                <CircleHelp className="h-2 w-2 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="shadow-sm">
              <div className="flex">
                <p>Accepted formats: </p>
                {dataTypes.map((type, i) => (
                  <Fragment key={type}>
                    <p className="font-semibold pl-1">{type}</p>
                    {i !== dataTypes.length - 1 && <p>, </p>}
                  </Fragment>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
        <div className="bg-muted rounded-md px-2 py-0.5">
          <p className="text-sm text-muted-foreground font-semibold">
            {input.label}
          </p>
        </div>
      </div>

      <Handle
        style={{
          height: "12px",
          width: "12px",
          backgroundColor: "white",
          border: "1px solid #6b7280",
          zIndex: 10,
        }}
        type={type}
        position={position}
      />
    </div>
  );
};
