import { AlarmClock, Loader2, Play, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useCallback, useState } from "react";
import { useNodesStore } from "@/providers/nodesProvider";

export const Toolbar = () => {
  const { nodes, addRunResult } = useNodesStore((state) => state);
  const [isRunning, setIsRunning] = useState(false);

  const run = useCallback(async () => {
    setIsRunning(true);
    const order = [
      "api-connector",
      "sec-filing",
      "summarizer",
      "dcf-model",
      "financial-analysis",
      "appender",
      "document-compiler",
    ];
    // const order = ["a", "b", "d", "e", "i", "f", "g"];
    for (const nodeType of order) {
      console.log("running ", nodeType);
      const node = nodes.find((node) => node.type === nodeType);
      if (!node) {
        // console.error("Node not found: ", nodeType);
        continue;
      }
      // console.log("node ", node);
      const result = await node?.data.runFn(node.data.params);

      addRunResult({
        id: nodeType,
        inputData: result.inputData,
        outputData: result.outputData,
        params: node.data.params,
      });
    }
    setIsRunning(false);
  }, [nodes, addRunResult]);

  return (
    <div className="flex items-center justify-between gap-2 p-2 bg-transparent backdrop-blur-md absolute top-2 left-1/2 -translate-x-1/2 z-20 shadow-sm border rounded-lg">
      <Button size="icon" className="bg-steel-blue-600 hover:bg-steel-blue-700">
        <Settings className="h-5 w-5" />
      </Button>
      <Button size="icon" className="bg-steel-blue-600 hover:bg-steel-blue-700">
        <AlarmClock className="h-5 w-5" />
      </Button>
      <Button
        className="bg-steel-blue-600 hover:bg-steel-blue-700"
        onClick={run}
        disabled={isRunning}
      >
        {isRunning ? (
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        ) : (
          <Play className="h-5 w-5 mr-2" />
        )}
        {isRunning ? "Running..." : "Run"}
      </Button>
    </div>
  );
};
