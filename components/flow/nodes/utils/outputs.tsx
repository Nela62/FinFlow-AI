import { NodeOutput } from "@/types/node";
import { OutputHandle } from "./output-handle";
import { useMemo } from "react";

export const Outputs = ({ outputs }: { outputs: NodeOutput[] }) => {
  // TODO: If multiple, calculate total handles based on number of outputs and supported file formats
  const totalOutputs = useMemo(() => outputs.length, [outputs]);

  return (
    <div>
      {outputs.map((output, index) => (
        <OutputHandle
          key={output.label}
          output={output}
          index={index}
          totalHandles={totalOutputs}
        />
      ))}
    </div>
  );
};
