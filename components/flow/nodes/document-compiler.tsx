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
import { ChevronDown, FolderOpen, Pencil, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "./utils/menu";

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

export type DocumentCompilerNodeData = { label: string };

export type DocumentCompilerNodeType = Node<DocumentCompilerNodeData>;

const outputFormats = [
  { type: ".html", image: "/output/json_logo.png" },
  { type: ".pdf", image: "/output/csv_logo.png" },
  { type: ".md", image: "/output/excel_logo.png" },
  { type: ".docx", image: "/output/excel_logo.png" },
];

function DocumentCompilerNodeComponent({
  id,
  data,
}: NodeProps<DocumentCompilerNodeType>) {
  const [templateStyle, setTemplateStyle] = useState<string>(
    "Company Update Report"
  );
  const [logo, setLogo] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

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
                <Button className="w-full" variant="outline">
                  {templateStyle}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>{templateStyle}</DropdownMenuItem>
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
                      {logo ?? "Select an option"}
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>{templateStyle}</DropdownMenuItem>
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
                      {logo ?? "Select an option"}
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>{templateStyle}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="icon">
                  <FolderOpen />
                </Button>
              </div>
            </div>
          </div>
          <Separator orientation="horizontal" />
          <div className="space-y-2">
            <p className="text-sm font-semibold">Output</p>
            <div className="flex gap-4">
              {outputFormats.map((outputFormat) => (
                <div
                  key={outputFormat.type}
                  className={cn(
                    "rounded-md p-1 space-y-1 border-2 cursor-pointer ",
                    selectedOutputFormat === outputFormat.type
                      ? "bg-steel-blue-200 border-steel-blue-500"
                      : "bg-muted border-transparent"
                  )}
                  onClick={() => {
                    setSelectedOutputFormat(outputFormat.type);
                  }}
                >
                  <div className="flex items-center justify-center bg-background rounded-md p-1">
                    <Image
                      src={outputFormat.image}
                      alt={outputFormat.type}
                      width={40}
                      height={40}
                    />
                  </div>
                  <p className="text-xs px-1">{outputFormat.type}</p>
                </div>
              ))}
            </div>
          </div>
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

export const DocumentCompilerNode = React.memo(DocumentCompilerNodeComponent);
