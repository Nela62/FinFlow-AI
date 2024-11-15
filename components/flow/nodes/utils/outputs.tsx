import { useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DataType, dataTypesList, NodeOutput } from "@/types/node";
import { useUpdateNodeInternals } from "@xyflow/react";

export const Outputs = ({
  nodeId,
  outputs,
  selectedOutputs,
  setSelectedOutputs,
}: {
  nodeId: string;
  outputs: NodeOutput[];
  selectedOutputs: NodeOutput[];
  setSelectedOutputs: React.Dispatch<React.SetStateAction<NodeOutput[]>>;
}) => {
  const outputsDataTypes = useMemo(() => {
    return outputs.map((output) => output.dataType);
  }, [outputs]);

  const outputsList = useMemo(() => {
    return dataTypesList.filter((dataType) =>
      outputsDataTypes.includes(dataType.name)
    );
  }, [outputsDataTypes]);

  const selectedOutputsDataTypes = useMemo(() => {
    return selectedOutputs.map((output) => output.dataType);
  }, [selectedOutputs]);

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">Output</p>
      <div className="flex gap-4">
        {outputsList.map((output) => (
          <div
            key={output.name}
            className={cn(
              "rounded-md p-1 space-y-1 border-2 cursor-pointer ",
              selectedOutputsDataTypes.includes(output.name)
                ? "bg-steel-blue-200 border-steel-blue-500"
                : "bg-muted border-transparent"
            )}
            onClick={() => {
              const newOutput = outputs.find((o) => o.dataType === output.name);
              if (!newOutput) return;

              const newSelectedOutputs = selectedOutputsDataTypes.includes(
                output.name
              )
                ? selectedOutputs.filter((o) => o.dataType !== output.name)
                : [...selectedOutputs, newOutput];
              setSelectedOutputs(newSelectedOutputs);
            }}
          >
            <div className="flex items-center justify-center bg-background rounded-md p-1">
              <Image
                src={output.imageLink}
                alt={output.name}
                width={40}
                height={40}
              />
            </div>
            <p className="text-xs px-1">{output.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
