import React from "react";
import type { SVGProps } from "react";

import Image from "next/image";
import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";
import { StockPicker } from "@/components/widgets/utils/stock-picker";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  NodeTabs,
  NodeTabsContent,
  NodeTabsList,
  NodeTabsTrigger,
} from "@/components/ui/node-tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NodeHeader } from "./utils/header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NodeSection } from "@/types/node-section";
import { useNodesStore } from "@/providers/nodesProvider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type SwitchNodeData = {};

export type SwitchNode = Node<SwitchNodeData>;

function MdiSwitch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M13 18h1a1 1 0 0 1 1 1h7v2h-7a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1H2v-2h7a1 1 0 0 1 1-1h1v-2H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3zm0-12h1V4h-1zM9 4v2h2V4zm0 4v2h2V8zm0 4v2h2v-2z"
      ></path>
    </svg>
  );
}

export function SwitchNode({ id, data }: NodeProps<SwitchNode>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const [handleCount, setHandleCount] = useState(2);

  console.log("render");

  const { nodes, edges } = useNodesStore((state) => state);

  const switchEdges = useMemo(() => {
    return edges.filter((edge) => edge.target === id);
  }, [edges]);

  const sourceNodes = useMemo(() => {
    return switchEdges.map((edge) => edge.source);
  }, [switchEdges]);

  const switchNodes = useMemo(() => {
    return nodes.filter((node) => sourceNodes.includes(node.id));
  }, [nodes, sourceNodes]);

  return (
    <div className="rounded-md bg-background p-1 pb-2 border max-w-[370px] min-w-[250px] space-y-2">
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
        title="Switch"
        bgColor="bg-gray-200"
        iconBgColor="bg-gray-400"
        textColor="text-gray-900"
        iconFn={MdiSwitch}
      />
      <RadioGroup
        defaultValue={switchNodes[0].id}
        className="px-2 py-2 space-y-2"
      >
        {switchNodes.map((node, i) => (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={node.id} id={node.id} />
            <Label htmlFor={node.id}>
              {/* @ts-ignore */}
              Input {i + 1}: {node.data.label ?? node.type}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {/* FIX: Edges don't rerender on new edge */}
      <Button
        variant="outline"
        onClick={() => {
          setHandleCount(handleCount + 1);
          updateNodeInternals(id);
        }}
      >
        Add Input
      </Button>
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
