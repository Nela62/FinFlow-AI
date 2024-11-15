import { cn } from "@/lib/utils";
import { useNodesStore } from "@/providers/nodesProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ResultContent } from "./nodes/utils/result-content";
import { useMemo } from "react";

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

  console.log("nodes ", nodes);
  console.log("edges ", edges);
  console.log("runNodeIds ", runNodeIds);
  console.log("runNodes ", runNodes);

  return (
    <div
      className={cn(
        "h-full border-l rounded-l-md bg-background border-gray-200 absolute top-0 right-0 w-1/3",
        runResults.length > 0 ? "block" : "hidden"
      )}
    >
      {runNodes.length > 0 && (
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
                  runResults.find((result) => result.id === node.id) ??
                  runResults[0]
                }
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};
