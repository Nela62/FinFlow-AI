import { useMemo } from "react";
import { NodeInput } from "@/types/node";
import { InputHandle } from "./input-handle";

export const Inputs = ({ inputs }: { inputs: NodeInput[] }) => {
  const inputsWithHandles = useMemo(
    () => inputs.filter((input) => input.handle.hasHandle === "true"),
    [inputs]
  );
  return (
    <div>
      {inputsWithHandles.map((input, index) => (
        <InputHandle
          key={input.label}
          input={input}
          index={index}
          totalHandles={inputsWithHandles.length}
        />
      ))}
    </div>
  );
};
