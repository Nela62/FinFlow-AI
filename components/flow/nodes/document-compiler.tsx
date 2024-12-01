import type { Node, NodeProps } from "@xyflow/react";
import {
  Handle,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { SVGProps, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NodeHeader } from "./utils/node-header";
import { Button } from "@/components/ui/button";
import { ChevronDown, FolderOpen, Pencil, X } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dataTypesList, NodeInput, NodeOutput } from "@/types/node";
import { useDebouncedCallback } from "use-debounce";
import { NodeWrapper } from "./utils/node-wrapper";
import { Outputs } from "./utils/output-selection";
import { res } from "./temp/report";

function BxFile(props: SVGProps<SVGSVGElement>) {
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
        d="M19.903 8.586a1 1 0 0 0-.196-.293l-6-6a1 1 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a1 1 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a1 1 0 0 0-.051-.259q-.014-.048-.033-.093M16.586 8H14V5.414zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10z"
      ></path>
      <path fill="currentColor" d="M8 12h8v2H8zm0 4h8v2H8zm0-8h2v2H8z"></path>
    </svg>
  );
}

const inputs: NodeInput[] = [
  {
    label: "text",
    acceptedFormat: "Text",
    acceptedTypes: dataTypesList
      .filter((item) => item.formats.includes("Text"))
      ?.map((item) => item.name),
  },
];

type Params = {
  templateStyle: string;
  logo: string | null;
  banner: string | null;
};

const defaultParams: Params = {
  templateStyle: "Company Update Report",
  logo: null,
  banner: null,
};

const outputs: NodeOutput[] = [
  { label: "output", dataType: "TXT" },
  { label: "output", dataType: "MD" },
  { label: "output", dataType: "PDF" },
  { label: "output", dataType: "DOCX" },
];

const runFn = async (params: Record<string, any>) => {
  return { inputData: res, params, outputData: res };
};

export type DocumentCompilerNodeData = {
  label: string;
  params: Params;
  inputs: NodeInput[];
  outputs: NodeOutput[];
  runFn: (params: Record<string, any>) => Promise<Record<string, any>>;
};

export type DocumentCompilerNodeType = Node<DocumentCompilerNodeData>;

export const defaultData: DocumentCompilerNodeData = {
  label: "Document Compiler",
  params: defaultParams,
  inputs,
  outputs: [{ label: "output", dataType: "MD" }],
  runFn,
};

function DocumentCompilerNodeComponent({
  id,
  data,
}: NodeProps<DocumentCompilerNodeType>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const [params, setParams] = useState<Record<string, any>>(data.params);
  const setParamsDebounced = useDebouncedCallback(
    (params: Record<string, any>) => {
      setParams(params);
    },
    1000
  );
  const { updateNodeData } = useReactFlow();

  const [selectedOutputs, setSelectedOutputs] = useState<NodeOutput[]>(
    data.outputs
  );

  useEffect(() => {
    updateNodeData(id, { params });
  }, [params]);

  useEffect(() => {
    updateNodeInternals(id);
    updateNodeData(id, { outputs: selectedOutputs });
  }, [selectedOutputs]);

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <NodeWrapper
      nodeId={id}
      width="w-[360px]"
      inputs={inputs}
      outputs={selectedOutputs}
    >
      <NodeHeader
        title="Document Compiler"
        bgColor="bg-amber-200"
        textColor="text-amber-900"
        iconFn={BxFile}
        iconBgColor="bg-amber-500"
      />

      <div className="space-y-2 px-2">
        <div className="space-y-2 nodrag">
          <p className="text-sm font-semibold">Template Style</p>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  {params.templateStyle}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  {params.templateStyle ?? "Select an option"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon">
              <Pencil />
            </Button>
          </div>
          <Separator orientation="horizontal" />
          <div className="space-y-3">
            <p className="text-sm font-semibold">Custom Branding</p>
            <div className="space-y-1">
              <p className="text-xs font-semibold">Logo</p>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {params.logo ?? "Select an option"}
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      {params.logo ?? "Select an option"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="icon">
                  <FolderOpen />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold">Banner</p>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {params.banner ?? "Select an option"}
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      {params.banner ?? "Select an option"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="icon">
                  <FolderOpen />
                </Button>
              </div>
            </div>
          </div>
          <Separator orientation="horizontal" />
          <Outputs
            nodeId={id}
            outputs={outputs}
            selectedOutputs={selectedOutputs}
            setSelectedOutputs={setSelectedOutputs}
          />
          <Separator orientation="horizontal" />

          <div className="flex justify-between">
            <p className="text-xs">Cache output</p>
            <div className="flex items-center space-x-2">
              <Switch defaultChecked={false} id="cache-output" className="" />
              <Label htmlFor="cache-output" className="text-xs">
                Yes
              </Label>
            </div>
          </div>
        </div>
      </div>
    </NodeWrapper>
  );
}

export const DocumentCompilerNode = React.memo(DocumentCompilerNodeComponent);
