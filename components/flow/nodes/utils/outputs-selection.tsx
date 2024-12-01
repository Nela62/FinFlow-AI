import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NodeOutput } from "@/types/node";
import { FILE_FORMAT_MAP } from "../constants/file-format-map";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";

export const OutputsSelection = ({
  nodeId,
  outputs: initialOutputs,
}: {
  nodeId: string;
  outputs: NodeOutput[];
}) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const [outputs, setOutputs] = useState<NodeOutput[]>(initialOutputs);

  const { updateNodeData } = useReactFlow();

  useEffect(() => {
    updateNodeInternals(nodeId);
    updateNodeData(nodeId, { outputs });
  }, [outputs]);

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">Output</p>
      <div>
        {outputs.map((output) => (
          <div key={output.label}>
            <p>{output.label}</p>
            <div className="flex gap-4">
              {output.definition.fileFormats.map((format) => (
                <div
                  key={format}
                  className={cn(
                    "rounded-md p-1 space-y-1 border-2 cursor-pointer ",
                    output.value.selected
                      ? "bg-steel-blue-200 border-steel-blue-500"
                      : "bg-muted border-transparent"
                  )}
                  onClick={() => {
                    const newOutput = {
                      ...output,
                      value: { selected: !output.value.selected },
                    };
                    setOutputs([...outputs, newOutput]);
                  }}
                >
                  <div className="flex items-center justify-center bg-background rounded-md p-1">
                    <Image
                      src={FILE_FORMAT_MAP[format].imageLink}
                      alt={format}
                      width={40}
                      height={40}
                    />
                  </div>
                  <p className="text-xs px-1">{format}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
