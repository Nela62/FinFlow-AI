import { cn } from "@/lib/utils";
import { useNodesStore } from "@/providers/nodesProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ResultContent } from "./nodes/utils/result-content";
import { useMemo } from "react";
import { res } from "./nodes/temp/api";
import { ScrollArea } from "../ui/scroll-area";

export const RunResultsSidebar = () => {
  const { nodes, runResults } = useNodesStore((state) => state);

  const runNodeIds = useMemo(
    () => runResults.map((result) => result.id),
    [runResults]
  );

  const runNodes = useMemo(
    () => runNodeIds.map((id) => nodes.find((node) => node.id === id)!),
    [nodes, runNodeIds]
  );

  return (
    <div
      className={cn(
        "h-full border-l rounded-l-md bg-background border-gray-200 absolute top-0 right-0 min-w-1/3 w-fit max-w-[800px]",
        runResults.length > 0 ? "block" : "hidden"
      )}
    >
      {runNodes.length > 0 && (
        <Tabs defaultValue={runNodes[0].id}>
          <TabsList>
            {runNodes.map((node) => (
              <TabsTrigger key={node.id} value={node.id}>
                {node.data.label}
              </TabsTrigger>
            ))}
          </TabsList>

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
