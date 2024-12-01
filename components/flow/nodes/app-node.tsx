import { memo } from "react";
import type { Node, NodeProps } from "@xyflow/react";

import { NodeData } from "@/types/node";
import { CONTENT_MAP, STYLE_MAP } from "./constants/node-map";
import { Inputs } from "./utils/inputs";
import { Outputs } from "./utils/outputs";
import { NodeMenu } from "./utils/menu";
import { NodeHeader } from "./utils/node-header";
import { OutputsSelection } from "./utils/outputs-selection";
import { Separator } from "@/components/ui/separator";

export type AppNodeType = Node<NodeData, "app-node">;

export const AppNode = memo(({ id, data }: NodeProps<AppNodeType>) => {
  const Content = CONTENT_MAP[data.type];
  const headerProps = STYLE_MAP[data.type];

  return (
    <div>
      <Inputs inputs={data.inputs} />
      <Outputs outputs={data.outputs} />
      <div className="group relative rounded-md bg-background border p-2 pb-3 shadow-md w-[450px]">
        <NodeMenu nodeId={id} />
        <NodeHeader {...headerProps} title={data.title} />
        <Content />
        {data.outputs.length > 0 && (
          <>
            <Separator orientation="horizontal" />
            <OutputsSelection nodeId={id} outputs={data.outputs} />
          </>
        )}
      </div>
    </div>
  );
});
