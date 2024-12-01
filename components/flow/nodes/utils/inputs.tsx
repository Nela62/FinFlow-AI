import { NodeInput } from "@/types/node";
import { InputHandle } from "./input-handle";

export const Inputs = ({ inputs }: { inputs: NodeInput[] }) => (
  <div>
    {inputs.map((input, index) => (
      <InputHandle
        key={input.label}
        input={input}
        index={index}
        totalHandles={inputs.length}
      />
    ))}
  </div>
);
