import { cn } from "@/lib/utils";
import { Menu } from "./menu";
import { NodeInput, NodeOutput } from "@/types/node";
import { Position } from "@xyflow/react";
import { InputHandle } from "./input-handle";
import { OutputHandle } from "./output-handle";

export const NodeWrapper = ({
  nodeId,
  inputs,
  outputs,
  children,
  width = "w-fit",
}: {
  nodeId: string;
  inputs: NodeInput[];
  outputs: NodeOutput[];
  children: React.ReactNode;
  width?: string;
}) => {
  return (
    <div className="">
      <div className="">
        {inputs.map((input, index) => (
          <InputHandle
            key={input.label}
            input={input}
            index={index}
            totalHandles={inputs.length}
          />
        ))}
      </div>
      <div className="">
        {outputs.map((output, index) => (
          <OutputHandle
            key={output.dataType}
            output={output}
            index={index}
            totalHandles={outputs.length}
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
