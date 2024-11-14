import Image from "next/image";
import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { SVGProps, useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NodeHeader } from "./utils/header";
import { Slider as DoubleSlider } from "@/components/ui/double-slider";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu } from "./utils/menu";

function IconParkOutlineSendEmail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 48 48"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
      >
        <path d="M44 24V9H4v30h20m20-5H30m9-5l5 5l-5 5"></path>
        <path d="m4 9l20 15L44 9"></path>
      </g>
    </svg>
  );
}

export type EmailSenderNodeData = { label: string };

export type EmailSenderNodeType = Node<EmailSenderNodeData>;

const outputFormats = [
  // { type: ".json", image: "/output/json_logo.png" },
  { type: ".csv", image: "/output/csv_logo.png" },
  { type: ".xlsx", image: "/output/excel_logo.png" },
  // { type: ".txt", image: "/output/txt_logo.png" },
];

function EmailSenderNodeComponent({
  id,
  data,
}: NodeProps<EmailSenderNodeType>) {
  // const [discountRate, setDiscountRate] = useState<number>(0.1);
  // const [timeHorizon, setTimeHorizon] = useState<number>(10);
  const [selectedOutputFormat, setSelectedOutputFormat] =
    useState<string>(".csv");

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="group relative rounded-md bg-background p-1 pb-2 border w-[320px] space-y-2 shadow-md">
      <Menu nodeId={id} />
      <Handle
        style={{
          height: "12px",
          width: "12px",
          backgroundColor: "white",
          border: "1px solid #6b7280",
        }}
        type="target"
        position={Position.Top}
      />
      <NodeHeader
        title="Email Sender"
        bgColor="bg-lime-200"
        textColor="text-lime-900"
        iconFn={IconParkOutlineSendEmail}
        iconBgColor="bg-lime-500"
      />

      <div className="space-y-2 px-2">
        <div className="space-y-4 nodrag">
          <p className="text-sm font-semibold">Settings</p>

          <div className="space-y-1 w-full">
            <p className="text-xs">Email sender</p>
            <Input className="w-full" type="email" />
          </div>
          <div className="space-y-1 w-full">
            <p className="text-xs">Email recipient</p>
            <Input className="w-full" type="email" />
          </div>
          <div className="space-y-1 w-full">
            <p className="text-xs">Subject</p>
            <Input className="w-full" type="text" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const EmailSenderNode = React.memo(EmailSenderNodeComponent);
