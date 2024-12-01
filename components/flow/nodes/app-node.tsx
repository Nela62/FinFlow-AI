import { memo, useState } from "react";
import type { Node, NodeProps } from "@xyflow/react";
import { NodeData, NodeOutput } from "@/types/node";
import { contentMap, styleMap } from "./constants/node-map";
import { Inputs } from "./utils/inputs";
import { Outputs } from "./utils/outputs";
import { NodeMenu } from "./utils/menu";
import { NodeHeader } from "./utils/node-header";

export type AppNodeType = Node<NodeData, "app-node">;

export const AppNode = memo(({ id, data }: NodeProps<AppNodeType>) => {
  const [selectedOutputs, setSelectedOutputs] = useState<NodeOutput[]>([]);
  const Content = contentMap[data.type];
  const headerProps = styleMap[data.type];

  return (
    <div>
      <Inputs inputs={data.inputs} />
      <Outputs outputs={data.outputs} />
      <div className="group relative rounded-md bg-background border p-2 pb-3 shadow-md w-[450px]">
        <NodeMenu nodeId={id} />
        <NodeHeader {...headerProps} title={data.title} />
        <Content />
      </div>
    </div>
  );
});
