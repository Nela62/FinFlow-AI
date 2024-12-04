import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Subtask, Task } from "@/types/run";
import { useNodesStore } from "@/providers/nodesProvider";
import { Check, CircleCheck, CircleDashed, Loader2 } from "lucide-react";

const TaskStatusIcon = ({ status }: { status: Task["status"] }) => {
  console.log("status", status);
  switch (status) {
    case "COMPLETED":
      return <CircleCheck className="h-4 w-4" />;
    case "STARTED":
      return <Loader2 className="h-4 w-4 animate-spin" />;
    case "PENDING":
    default:
      return <CircleDashed className="h-4 w-4" />;
  }
};

export const RunLogs = () => {
  const { selectedRunId } = useNodesStore((state) => state);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  // TODO: check if the run is still running - then listen in real time. once the run is completed, stop listening.
  // TODO: on render, fetch all tasks and subtasks for the run.
  useEffect(() => {
    setTasks([]);
    setSubtasks([]);
  }, [selectedRunId]);

  const taskSubtasksMap = useMemo(() => {
    return subtasks.reduce(
      (acc, subtask) => {
        if (!acc[subtask.taskId]) {
          acc[subtask.taskId] = [];
        }
        acc[subtask.taskId].push(subtask);
        return acc;
      },
      {} as Record<string, Subtask[]>
    );
  }, [subtasks]);

  const supabase = createClient();

  useEffect(() => {
    console.log("listening to tasks for run ", selectedRunId);
    const tasksChannel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `execution_id=eq.${selectedRunId}`,
        },
        (payload) => {
          console.log("payload", payload);
          setTasks((prev) => {
            const existingTaskIndex = prev.findIndex(
              (task) => task.id === (payload.new as any).id
            );

            const newTask = {
              id: (payload.new as any).id,
              name: (payload.new as any).name,
              status: (payload.new as any).status,
              inputValues: (payload.new as any).input_values,
              outputValues: (payload.new as any).output_values,
              startedAt: (payload.new as any).started_at,
              completedAt: (payload.new as any).completed_at,
            };

            if (existingTaskIndex >= 0) {
              const newTasks = [...prev];
              newTasks[existingTaskIndex] = newTask;
              return newTasks;
            }

            return [...prev, newTask];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
    };
  }, [selectedRunId]);

  useEffect(() => {
    const subtasksChannel = supabase
      .channel("subtasks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subtasks",
          filter: `execution_id=eq.${selectedRunId}`,
        },
        (payload) => {
          setSubtasks((prev) => {
            const existingSubtaskIndex = prev.findIndex(
              (subtask) => subtask.id === (payload.new as any).id
            );

            const newSubtask = {
              id: (payload.new as any).id,
              taskId: (payload.new as any).task_id,
              name: (payload.new as any).name,
              status: (payload.new as any).status,
              startedAt: (payload.new as any).started_at,
              completedAt: (payload.new as any).completed_at,
            };

            if (existingSubtaskIndex >= 0) {
              const newSubtasks = [...prev];
              newSubtasks[existingSubtaskIndex] = newSubtask;
              return newSubtasks;
            }

            return [...prev, newSubtask];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subtasksChannel);
    };
  }, [selectedRunId]);

  return (
    <div className="space-y-2 py-2">
      {tasks
        .sort(
          (a, b) =>
            new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
        )
        .map((task) => (
          <div key={task.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <TaskStatusIcon status={task.status} />
              <p className="">{task.name}</p>
            </div>
            <div className="pl-6">
              {taskSubtasksMap[task.id].map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2">
                  <TaskStatusIcon status={subtask.status} />
                  <p className="text-sm text-muted-foreground">
                    {subtask.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};
