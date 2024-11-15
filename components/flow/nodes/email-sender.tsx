import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { SVGProps, useEffect, useState } from "react";
import { NodeHeader } from "./utils/header";
import { Input } from "@/components/ui/input";
import React from "react";
import { Menu } from "./utils/menu";
import { NodeInput, NodeOutput } from "@/types/node";
import { useDebouncedCallback } from "use-debounce";

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

// TODO: Make files and text optional but one mandatory and allow several files
const inputs: NodeInput[] = [
  { label: "text", acceptedFormat: "Text", acceptedTypes: ["TXT"] },
  { label: "file", acceptedFormat: "File", acceptedTypes: ["PDF", "DOCX"] },
];

type Params = {
  sender: string;
  recipient: string;
  subject: string;
};

const defaultParams: Params = {
  sender: "",
  recipient: "",
  subject: "",
};

const outputs: NodeOutput[] = [];

const runFn = async (params: Record<string, any>) => {
  return {};
};

export type EmailSenderNodeData = {
  label: string;
  params: Params;
  inputs: NodeInput[];
  outputs: NodeOutput[];
  runFn: (params: Record<string, any>) => Promise<Record<string, any>>;
};

export const defaultData: EmailSenderNodeData = {
  label: "Email Sender",
  params: defaultParams,
  inputs,
  outputs,
  runFn,
};

export type EmailSenderNodeType = Node<EmailSenderNodeData>;

function EmailSenderNodeComponent({
  id,
  data,
}: NodeProps<EmailSenderNodeType>) {
  const [params, setParams] = useState<Record<string, any>>(data.params);
  const setParamsDebounced = useDebouncedCallback(
    (params: Record<string, any>) => {
      setParams(params);
    },
    1000
  );
  const { updateNodeData } = useReactFlow();

  // TODO: Set params
  useEffect(() => {
    updateNodeData(id, { params });
  }, [params]);

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
