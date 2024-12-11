import { AlarmClock, Loader2, Play, Plus, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useCallback, useState } from "react";
import { useNodesStore } from "@/providers/nodesProvider";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { DialogTrigger } from "../ui/dialog";
import { TriggerContent } from "./triggers/trigger-content";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchNodesByWorkflowId } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { TOP_BAR_HEIGHT } from "@/lib/const";
import { Separator } from "../ui/separator";

export type Trigger = {
  id: string;
  name: string;
  config: Record<string, any>;
};

export const Toolbar = ({ workflowId }: { workflowId: string }) => {
  const { setSelectedRunId, setIsRunning, isRunning } = useNodesStore(
    (state) => state
  );
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const supabase = createClient();

  const addTrigger = useCallback((trigger: Trigger) => {
    setTriggers((prev) => [...prev, trigger]);
  }, []);

  const runWorkflow = useCallback(async () => {
    setIsRunning(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error("No session found");

    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/workflows/${workflowId}/executions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );
    if (res.ok) {
      const { execution_id: executionId } = await res.json();
      setSelectedRunId(executionId);
    } else {
      setIsRunning(false);
    }
  }, [workflowId]);

  return (
    <div
      className="grow flex items-center justify-end pr-4 h-fit gap-2 backdrop-blur-md bg-background/80 shadow-sm border-b border-slate-300 z-20 pointer-events-auto"
      style={{ height: TOP_BAR_HEIGHT }}
    >
      <Separator orientation="vertical" className="h-full text-slate-300" />
      <Button size="icon" variant="ghost" className="h-fit w-fit p-1.5">
        <Settings className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-full text-slate-300" />
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="h-fit w-fit p-1.5">
          <AlarmClock className="h-4 w-4" />
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
          <Button
            variant="outline"
            size="sm"
            className="flex gap-2  h-fit w-fit p-2"
          >
            <Plus className="h-4 w-4" />
            New Trigger
          </Button>
        </DialogTrigger>
        <TriggerContent addTrigger={addTrigger} />
      </PopoverContent>
      <Separator orientation="vertical" className="h-full text-slate-300" />
      <Button
        variant="ghost"
        className="w-fit p-1.5 h-fit"
        onClick={runWorkflow}
        disabled={isRunning}
      >
        {isRunning ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Play className="h-4 w-4 mr-2" />
        )}
        {isRunning ? "Running..." : "Run"}
      </Button>
    </div>
  );
};
