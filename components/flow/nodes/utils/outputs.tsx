import { NodeOutput } from "@/types/node";
import { OutputHandle } from "./output-handle";

export const Outputs = ({ outputs }: { outputs: NodeOutput[] }) => (
  <div>
    {outputs.map((output, index) => (
      <OutputHandle
        key={output.label}
        output={output}
        index={index}
        totalHandles={outputs.length}
      />
    ))}
  </div>
);
