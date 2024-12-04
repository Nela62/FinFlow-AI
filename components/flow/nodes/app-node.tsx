import { memo } from "react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import { NodeType } from "@/types/node";
import { CONTENT_MAP, STYLE_MAP } from "./constants/node-map";
import { Inputs } from "./components/inputs";
import { Outputs } from "./components/outputs";
import { NodeMenu } from "./components/menu";
import { NodeHeader } from "./components/node-header";
import { OutputsSelection } from "./components/outputs-selection";
import { Separator } from "@/components/ui/separator";
import { NodeData } from "@/types/react-flow";

export type AppNodeType = Node<NodeData, "app-node">;

export const AppNode = memo(({ id, data }: NodeProps<AppNodeType>) => {
  const { updateNodeData, getNodes } = useReactFlow();

  if (!Object.values(NodeType).includes(data.type as NodeType)) {
    throw new Error(`Invalid node type: ${data.type}`);
  }
  const Content = CONTENT_MAP[data.type as NodeType];
  const headerProps = STYLE_MAP[data.type as NodeType];

  return (
    <div>
      <Inputs inputs={data.inputs} />
      <Outputs outputs={data.outputs} />
      <div className="group relative rounded-md bg-background border p-2 pb-3 shadow-md w-[380px]">
        <NodeMenu nodeId={id} />
        <NodeHeader {...headerProps} title={data.title} />
        <Content id={id} data={data} updateNodeData={updateNodeData} />
        {data.outputs.length > 1 && (
          <>
            <Separator orientation="horizontal" />
            <OutputsSelection nodeId={id} outputs={data.outputs} />
          </>
        )}
      </div>
    </div>
  );
});
