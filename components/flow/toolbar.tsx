import { AlarmClock, Loader2, Play, Plus, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useCallback, useState } from "react";
import { useNodesStore } from "@/providers/nodesProvider";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { DialogTrigger } from "../ui/dialog";
import { TriggerContent } from "./utils/trigger-content";

export type Trigger = {
  id: string;
  name: string;
  config: Record<string, any>;
};

export const Toolbar = () => {
  const { nodes, addRunResult } = useNodesStore((state) => state);
  const [isRunning, setIsRunning] = useState(false);
  const [triggers, setTriggers] = useState<Trigger[]>([]);

  const addTrigger = useCallback((trigger: Trigger) => {
    setTriggers((prev) => [...prev, trigger]);
  }, []);

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
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="bg-steel-blue-600 hover:bg-steel-blue-700"
        >
          <AlarmClock className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-2 mt-4">
        <p className="text-sm font-semibold">Triggers</p>
        {triggers.length > 0 ? (
          triggers.map((trigger) => (
            <div key={trigger.id}>
              <p className="truncate">
                {trigger.name} - {Object.values(trigger.config).join(" - ")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No triggers yet
          </p>
        )}
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex gap-2">
            <Plus className="h-4 w-4" />
            New Trigger
          </Button>
        </DialogTrigger>
        <TriggerContent addTrigger={addTrigger} />
      </PopoverContent>
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
