"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NodeRunResult } from "@/types/node";
import Markdown from "react-markdown";

import remarkGfm from "remark-gfm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useMemo, useState } from "react";
import { useNodesStore } from "@/providers/nodesProvider";
import { ChevronDownIcon } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import ReactJson with ssr disabled
const ReactJson = dynamic(() => import("react-json-view"), {
  ssr: false,
});

const getContent = (content: any) => {
  if (typeof content === "object") {
    return <ReactJson src={content} style={{ width: "480px" }} />;
  }
  return (
    <Markdown
      components={{
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto w-[480px]">
            <table
              {...props}
              style={{
                width: "100%",
              }}
              className="text-xs whitespace-nowrap"
            />
          </div>
        ),
        p: ({ node, ...props }) => (
          <p className="max-w-[470px] text-wrap text-sm py-1" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-lg font-semibold py-2" {...props} />
        ),
      }}
      remarkPlugins={[remarkGfm]}
      className="markdown w-fit"
    >
      {content}
    </Markdown>
  );
};

export const ResultContent = ({
  resultRuns,
}: {
  resultRuns: NodeRunResult[];
}) => {
  const [selectedResult, setSelectedResult] = useState<NodeRunResult | null>(
    resultRuns[resultRuns.length - 1]
  );

  useEffect(() => {
    setSelectedResult(resultRuns[resultRuns.length - 1]);
  }, [resultRuns]);

  const { nodes, runResults, edges } = useNodesStore((state) => state);

  const runNodeIds = useMemo(
    () => runResults.map((result) => result.id),
    [runResults]
  );

  const runNodes = useMemo(
    () => runNodeIds.map((id) => nodes.find((node) => node.type === id)!),
    [nodes, runNodeIds]
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-4 px-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-[34px] w-1/4">
              Inputs
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[620px] h-[80vh]">
            <DialogHeader>
              <DialogTitle>Inputs</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(100%-50px)]">
              {getContent(selectedResult?.inputData)}
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-[34px] w-1/4">
              Params
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[620px] h-[80vh]">
            <DialogHeader>
              <DialogTitle>Params</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(100%-50px)]">
              {getContent(selectedResult?.params)}
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-[34px] w-1/2 text-xs flex justify-between items-center"
            >
              {
                runNodes.find((node) => node.type === selectedResult?.id)?.data
                  .label
              }
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {resultRuns.map((result) => (
              <DropdownMenuItem
                key={result.id}
                onClick={() => setSelectedResult(result)}
              >
                {runNodes.find((node) => node.type === result.id)?.data.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="h-[calc(100vh-140px)] w-full px-4 py-2">
        {/* <ScrollBar orientation="horizontal" /> */}
        <h2 className="text-lg font-semibold py-2">Output</h2>

        {getContent(selectedResult?.outputData)}
      </ScrollArea>
    </div>
  );
};
