"use client";

import { cn } from "@/lib/utils";
import { useNodesStore } from "@/providers/nodesProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ResultContent } from "./nodes/components/result-content";
import { useMemo } from "react";
import { ResultLogs } from "./nodes/components/result-logs";

export const RunResultsSidebar = () => {
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
    <div
      className={cn(
        "flex flex-col gap-4 w-[500px] h-full absolute top-4 bottom-0 right-4 border rounded-md backdrop-blur-md bg-background/40 shadow-sm",
        runResults.length > 0 ? "block" : "hidden"
      )}
    >
      <Tabs defaultValue="output">
        <TabsList className="w-full">
          <TabsTrigger value="logs" className="w-1/2">
            Logs
          </TabsTrigger>
          <TabsTrigger value="output" className="w-1/2">
            Output
          </TabsTrigger>
        </TabsList>
        <TabsContent value="output">
          <ResultContent resultRuns={runResults} />
        </TabsContent>
        <TabsContent value="logs">
          <ResultLogs resultRuns={runResults} />
        </TabsContent>
      </Tabs>
      {/* {runNodes.length > 0 && (
        <Tabs defaultValue={runNodes[runNodes.length - 1].id}>
          <div className="relative rounded-sm overflow-x-scroll h-10 bg-muted">
            <TabsList className="absolute flex flex-row justify-stretch w-full">
              {runNodes.map((node) => (
                <TabsTrigger className="w-full" key={node.id} value={node.id}>
                  {node.data.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {runNodes.map((node) => (
            <TabsContent key={node.id} value={node.id}>
              <ResultContent
                result={
                  runResults.find((result) => result.id === node.type) ??
                  runResults[runNodes.length - 1]
                }
              />
            </TabsContent>
          ))}
        </Tabs>
      )} */}
    </div>
  );
};
