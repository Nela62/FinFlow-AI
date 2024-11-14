import React from "react";
import type { SVGProps } from "react";

import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { NodeHeader } from "./utils/header";
import { Button } from "@/components/ui/button";
import { useNodesStore } from "@/providers/nodesProvider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SortableList from "./utils/sortableList";

export type AppenderNodeData = { label: string };

export type AppenderNodeType = Node<AppenderNodeData>;

function FluentMerge16Filled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        d="M2 4.25a.75.75 0 0 1 .75-.75h1.789c.835 0 1.625.38 2.147 1.032l1.499 1.874a2.25 2.25 0 0 0 1.757.844h1.785l-1.572-2.043a.75.75 0 0 1 1.19-.914l2.5 3.25a.75.75 0 0 1 0 .914l-2.5 3.25a.75.75 0 0 1-1.19-.914l1.572-2.043H9.71c-.38 0-.739.173-.976.47l-1.499 1.873A3.75 3.75 0 0 1 4.308 12.5H2.75a.75.75 0 0 1 0-1.5h1.558c.684 0 1.33-.31 1.757-.844l1.499-1.874a3 3 0 0 1 .203-.227a3.8 3.8 0 0 1-.753-.712l-1.5-1.874A1.25 1.25 0 0 0 4.54 5H2.75A.75.75 0 0 1 2 4.25"
      ></path>
    </svg>
  );
}

function AppenderNodeComponent({ id, data }: NodeProps<AppenderNodeType>) {
  const updateNodeInternals = useUpdateNodeInternals();

  const { nodes, edges } = useNodesStore((state) => state);

  const appenderEdges = useMemo(() => {
    return edges.filter((edge) => edge.target === id);
  }, [edges]);

  const sourceNodes = useMemo(() => {
    return appenderEdges.map((edge) => edge.source);
  }, [appenderEdges]);

  const appenderNodes = useMemo(() => {
    return Array.isArray(nodes)
      ? nodes?.filter((node) => sourceNodes.includes(node.id))
      : [];
  }, [nodes, sourceNodes]);

  const [handleCount, setHandleCount] = useState(appenderNodes.length ?? 1);

  return (
    <div className="rounded-md bg-background p-1 pb-2 border max-w-[370px] min-w-[250px] space-y-2 shadow-md">
      {Array.from({ length: handleCount }).map((_, index) => (
        <Handle
          key={index}
          type="target"
          style={{
            left: `${(index + 1) * (100 / (handleCount + 1))}%`,
            transform: "translateX(-50%)",
            marginTop: "-5px",
            height: "12px",
            width: "12px",
            backgroundColor: "white",
            border: "1px solid #6b7280",
          }}
          position={Position.Top}
          id={`handle-${index}`}
        />
      ))}

      <NodeHeader
        title="Appender"
        bgColor="bg-neutral-200"
        iconBgColor="bg-neutral-400"
        textColor="text-neutral-900"
        iconFn={FluentMerge16Filled}
      />
      <div className="space-y-4 px-2 pt-2">
        <p className="text-sm font-semibold">Order</p>
        <SortableList
          items={appenderNodes.map((node) => ({
            id: node.id,
            title: node.data.label ?? node.type,
          }))}
        />

        <Button
          variant="outline"
          onClick={() => {
            setHandleCount(handleCount + 1);
            updateNodeInternals(id);
          }}
        >
          Add Input
        </Button>
      </div>

      <Handle
        style={{
          height: "12px",
          width: "12px",
          backgroundColor: "white",
          border: "1px solid #6b7280",
        }}
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
}

export const AppenderNode = React.memo(AppenderNodeComponent);
