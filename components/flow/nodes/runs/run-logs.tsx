import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Subtask, Task } from "@/types/run";
import { useNodesStore } from "@/providers/nodesProvider";
import { CheckIcon, Loader2 } from "lucide-react";

export const RunLogs = () => {
  const { selectedRunId } = useNodesStore((state) => state);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const tasksChannel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        (payload) => {
          console.log(payload);
          setTasks((prev) => [
            ...prev,
            {
              id: (payload.new as any).id,
              name: (payload.new as any).name,
              status: (payload.new as any).status,
              inputValues: (payload.new as any).input_values,
              outputValues: (payload.new as any).output_values,
              startedAt: (payload.new as any).started_at,
              completedAt: (payload.new as any).completed_at,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
    };
  }, []);

  return (
    <div className="space-y-2 py-2">
      {tasks
        .sort(
          (a, b) =>
            new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
        )
        .map((task) => (
          <div key={task.id} className="flex items-center gap-2">
            {task.status !== "COMPLETED" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckIcon className="h-4 w-4" />
            )}
            <p className="">{task.name}</p>
          </div>
        ))}
    </div>
  );
};
