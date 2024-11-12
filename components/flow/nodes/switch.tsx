import React from "react";
import type { SVGProps } from "react";

import Image from "next/image";
import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
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

export function SwitchNode({ data }: NodeProps<SwitchNode>) {
  const [inputsNum, setInputsNum] = useState<number>(2);

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="rounded-md bg-background p-1 pb-2 border max-w-[370px] space-y-2">
      {Array.from({ length: inputsNum }).map((_, index) => (
        <Handle
          key={index}
          style={{
            height: "12px",
            width: "12px",
            backgroundColor: "white",
            border: "1px solid #6b7280",
          }}
          type="target"
          position={Position.Top}
        />
      ))}
      <NodeHeader
        title="Switch"
        bgColor="bg-gray-200"
        iconBgColor="bg-gray-400"
        textColor="text-gray-900"
        iconFn={MdiSwitch}
      />
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
