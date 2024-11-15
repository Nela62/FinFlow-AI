import { cn } from "@/lib/utils";
import { Menu } from "./menu";
import { NodeInput } from "@/types/node";
import { Position } from "@xyflow/react";
import { DefaultHandle } from "./default-handle";

export const NodeWrapper = ({
  nodeId,
  inputs,
  children,
  width = "w-fit",
}: {
  nodeId: string;
  inputs: NodeInput[];
  children: React.ReactNode;
  width?: string;
}) => {
  return (
    <div>
      <div>
        {inputs.map((input) => (
          <DefaultHandle
            key={input.label}
            input={input}
            type="target"
            position={Position.Top}
          />
        ))}
      </div>
      <div
        className={cn(
          "group relative rounded-md bg-background border p-2 pb-3 shadow-md",
          width
        )}
      >
        <Menu nodeId={nodeId} />
        <div className="">{children}</div>
      </div>
    </div>
  );
};
