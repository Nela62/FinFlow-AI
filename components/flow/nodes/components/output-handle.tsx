import { NodeOutput } from "@/types/node";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

export const OutputHandle = ({
  output,
  index,
  totalHandles,
}: {
  output: NodeOutput;
  index: number;
  totalHandles: number;
}) => {
  // TODO: Add support for multiple
  const selectedFileFormat = output.supportedFileFormats.find(
    (format) => format.value.selected
  );

  if (!selectedFileFormat) return null;

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
          {/* <File className="h-2 w-2 text-muted-foreground" /> */}
          <p className="text-xs text-muted-foreground">
            {output.isList
              ? `List[${selectedFileFormat.fileFormat}]`
              : selectedFileFormat.fileFormat}
          </p>
        </div>
      </div>

      <Handle
        id={`handle-${selectedFileFormat.fileFormat}`}
        style={{
          left: `${(index + 1) * (100 / (totalHandles + 1))}%`,
          transform: "translateX(-50%) translateY(50%)",
          height: "16px",
          width: "16px",
          backgroundColor: "white",
          border: "2px solid #6b7280",
          zIndex: 10,
        }}
        type="source"
        position={Position.Bottom}
      />
    </>
  );
};
