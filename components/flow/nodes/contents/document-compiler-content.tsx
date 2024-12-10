import type { Node, NodeProps } from "@xyflow/react";
import {
  Handle,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { memo, SVGProps, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NodeHeader } from "../components/node-header";
import { Button } from "@/components/ui/button";
import { ChevronDown, FolderOpen, Pencil, X } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NodeInput, NodeOutput, NodeType } from "@/types/node";
import { useDebouncedCallback } from "use-debounce";
import { res } from "../temp/report";
import { DataCategory, FileFormat } from "@/types/dataFormat";
import { NodeData } from "@/types/react-flow";
import { createUpdateConfigValue } from "@/lib/update-config-value";
import { useInputValue } from "@/hooks/use-input-value";

const inputs: NodeInput[] = [
  {
    label: "text",
    handle: {
      hasHandle: "true",
      dataCategory: DataCategory.Text,
      fileFormats: [FileFormat.TXT, FileFormat.MD],
      isList: false,
      dynamic: true,
    },
    value: "",
  },
  { label: "logo", handle: { hasHandle: "false" }, value: "" },
  { label: "banner", handle: { hasHandle: "false" }, value: "" },
  {
    label: "template_style",
    handle: { hasHandle: "false" },
    value: "Company Update Report",
  },
];

const outputs: NodeOutput[] = [
  {
    label: "document",
    allowMultiple: false,
    supportedFileFormats: [
      { fileFormat: FileFormat.PDF, value: { selected: true } },
    ],
    isList: false,
  },
];

export const DOCUMENT_COMPILER_NODE_DEFAULT_DATA: NodeData = {
  title: "Document Compiler",
  type: NodeType.DOCUMENT_COMPILER,
  inputs,
  outputs,
};

export const DocumentCompilerContent = memo(
  ({ id, data }: { id: string; data: NodeData }) => {
    const [config, setConfig] = useState<NodeInput[]>(data.inputs);

    const { updateNodeData } = useReactFlow();

    const updateConfigValue = createUpdateConfigValue(setConfig);

    const selectedTemplateStyle = useInputValue(config, "template_style");
    const selectedLogo = useInputValue(config, "logo");
    const selectedBanner = useInputValue(config, "banner");

    useEffect(() => {
      updateNodeData(id, { inputs: config });
    }, [config]);

    return (
      <div className="space-y-4 px-2 py-q">
        <p className="text-sm font-semibold">Template Style</p>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full justify-start" variant="outline">
                {selectedTemplateStyle}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                {!!selectedTemplateStyle || "Select an option"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon">
            <Pencil />
          </Button>
        </div>
        {/* <Separator orientation="horizontal" /> */}

        <p className="text-sm font-semibold">Custom Branding</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold">Logo</p>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {!!selectedLogo || "Select an option"}
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    {!!selectedLogo || "Select an option"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon">
                <FolderOpen />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold">Banner</p>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedBanner || "Select an option"}
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    {selectedBanner || "Select an option"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon">
                <FolderOpen />
              </Button>
            </div>
          </div>
        </div>

        {/* <div className="flex justify-between">
            <p className="text-xs">Cache output</p>
            <div className="flex items-center space-x-2">
              <Switch defaultChecked={false} id="cache-output" className="" />
              <Label htmlFor="cache-output" className="text-xs">
                Yes
              </Label>
            </div>
          </div> */}
      </div>
    );
  }
);
