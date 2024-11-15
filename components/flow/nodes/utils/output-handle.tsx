import { File } from "lucide-react";
import { NodeOutput } from "@/types/node";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

// TODO: add handle id
export const OutputHandle = ({
  output,
  index,
  totalHandles,
}: {
  output: NodeOutput;
  index: number;
  totalHandles: number;
}) => {
  console.log("output", output);
  return (
    <>
      <div
        className={cn(
          "absolute -translate-x-1/2 z-10 flex flex-col gap-1 items-center -bottom-9 translate-y-1/2"
        )}
        style={{ left: `${(index + 1) * (100 / (totalHandles + 1))}%` }}
      >
        <div className="bg-muted rounded-md px-2 py-0.5">
          <p className="text-sm text-muted-foreground font-semibold">
            {output.label}
          </p>
        </div>
        <div className="flex gap-1 bg-background rounded-md px-2 py-0.5 items-center">
          <File className="h-2 w-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{output.dataType}</p>
        </div>
      </div>

      <Handle
        style={{
          left: `${(index + 1) * (100 / (totalHandles + 1))}%`,
          transform: "translateX(-50%) translateY(50%)",
          height: "12px",
          width: "12px",
          backgroundColor: "white",
          border: "1px solid #6b7280",
          zIndex: 10,
        }}
        type="source"
        position={Position.Bottom}
      />
    </>
  );
};
