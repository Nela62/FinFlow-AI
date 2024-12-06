import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Execution, IOValue, Subtask, Task } from "@/types/run";
import { useNodesStore } from "@/providers/nodesProvider";
import {
  Check,
  CircleCheck,
  CircleDashed,
  Loader2,
  Maximize2,
} from "lucide-react";
import {
  fetchAllSubtasksByExecutionId,
  fetchExecutionById,
} from "@/lib/queries";
import { fetchAllTasksByExecutionId } from "@/lib/queries";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TasksDetails } from "./tasks-details";
import { Skeleton } from "@/components/ui/skeleton";
import {
  REALTIME_CHANNEL_STATES,
  RealtimeChannel,
} from "@supabase/supabase-js";

// TODO: add icons before each task name
// TODO: add separators between tasks
// TODO: remove padding so separators are full width

const TaskStatusIcon = ({ status }: { status: Task["status"] }) => {
  switch (status) {
    case "COMPLETE":
      return <CircleCheck className="h-4 w-4 text-primary/80" />;
    case "STARTED":
      return <Loader2 className="h-4 w-4 animate-spin text-primary/80" />;
    case "PENDING":
    default:
      return <CircleDashed className="h-4 w-4 text-primary/80" />;
  }
};

// TODO: add a timer showing the time since the task started.

export const RunLogs = () => {
  const { selectedRunId, setIsRunning } = useNodesStore((state) => state);
  const [execution, setExecution] = useState<Execution | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    setExecution(null);
    setTasks([]);
    setSubtasks([]);
  }, [selectedRunId]);

  const init = useCallback(
    async (channel: RealtimeChannel) => {
      if (!selectedRunId) return;
      setIsLoading(true);

      channel.subscribe();

      const runRes = await fetchExecutionById(supabase, selectedRunId);

      // console.log("subtasksRes", subtasksRes);

      if (!runRes.data) {
        setIsLoading(false);
        throw new Error("Failed to fetch run data");
      }

      if (runRes.data?.status === "COMPLETE") {
        channel.unsubscribe();
        supabase.removeChannel(channel);

        const [tasksRes, subtasksRes] = await Promise.all([
          fetchAllTasksByExecutionId(supabase, selectedRunId),
          fetchAllSubtasksByExecutionId(supabase, selectedRunId),
        ]);

        setExecution({
          ...runRes.data,
          startedAt: runRes.data?.started_at,
          completedAt: runRes.data?.completed_at,
        });

        if (!tasksRes.data || !subtasksRes.data) {
          setIsLoading(false);
          throw new Error("Failed to fetch run data");
        }

        setTasks(
          tasksRes.data.map((t) => ({
            ...t,
            inputValues: t.input_values as IOValue[],
            outputValues: t.output_values as IOValue[],
            startedAt: t.started_at,
            completedAt: t.completed_at,
          }))
        );
        setSubtasks(
          subtasksRes.data.map((t) => ({
            ...t,
            createdAt: t.created_at,
            updatedAt: t.updated_at,
            taskId: t.task_id,
          }))
        );
      } else {
        while (channel.state !== REALTIME_CHANNEL_STATES.joined) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const [tasksRes, subtasksRes] = await Promise.all([
          fetchAllTasksByExecutionId(supabase, selectedRunId),
          fetchAllSubtasksByExecutionId(supabase, selectedRunId),
        ]);

        if (!tasksRes.data || !subtasksRes.data) {
          setIsLoading(false);
          throw new Error("Failed to fetch run data");
        }

        console.log("channel joined");
        console.log("tasksRes.data", tasksRes.data);
        console.log("subtasksRes.data", subtasksRes.data);

        !execution &&
          setExecution({
            id: runRes.data?.id,
            name: runRes.data?.name,
            status: runRes.data?.status,
            startedAt: runRes.data?.started_at,
            completedAt: runRes.data?.completed_at,
          });

        setTasks((prev) => [
          ...prev,
          ...tasksRes.data
            .filter((t) => !prev.some((p) => p.id === t.id))
            .map((t) => ({
              ...t,
              inputValues: t.input_values as IOValue[],
              outputValues: t.output_values as IOValue[],
              startedAt: t.started_at,
              completedAt: t.completed_at,
            })),
        ]);

        setSubtasks((prev) => [
          ...prev,
          ...subtasksRes.data
            .filter((t) => !prev.some((p) => p.id === t.id))
            .map((t) => ({
              ...t,
              createdAt: t.created_at,
              updatedAt: t.updated_at,
              taskId: t.task_id,
            })),
        ]);
      }

      setIsLoading(false);
    },
    [selectedRunId]
  );

  useEffect(() => {
    if (execution?.status === "COMPLETE") {
      setIsRunning(false);
    }
  }, [execution?.status]);

  useEffect(() => {
    const channel = supabase
      .channel(`run-${selectedRunId}-updates`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "executions",
          filter: `id=eq.${selectedRunId}`,
        },
        (payload) => {
          console.log("payload", payload);
          setExecution((prev) => {
            const newExecution = {
              id: (payload.new as any).id,
              name: (payload.new as any).name,
              status: (payload.new as any).status,
              startedAt: (payload.new as any).started_at,
              completedAt: (payload.new as any).completed_at,
            };

            return newExecution;
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `execution_id=eq.${selectedRunId}`,
        },
        (payload) => {
          console.log("tasks payload", payload);

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
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subtasks",
          filter: `execution_id=eq.${selectedRunId}`,
        },
        (payload) => {
          console.log("subtasks payload", payload);

          setSubtasks((prev) => {
            const existingSubtaskIndex = prev.findIndex(
              (subtask) => subtask.id === (payload.new as any).id
            );

            const newSubtask = {
              id: (payload.new as any).id,
              taskId: (payload.new as any).task_id,
              name: (payload.new as any).name,
              status: (payload.new as any).status,
              createdAt: (payload.new as any).created_at,
              updatedAt: (payload.new as any).updated_at,
            };

            if (existingSubtaskIndex >= 0) {
              const newSubtasks = [...prev];
              newSubtasks[existingSubtaskIndex] = newSubtask;
              return newSubtasks;
            }

            return [...prev, newSubtask];
          });
        }
      );

    init(channel);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [init]);

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

  return (
    <div className="space-y-2 py-2 px-4">
      {!isLoading ? (
        tasks
          .sort(
            (a, b) =>
              new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
          )
          .map((task) => (
            <div key={task.id} className="space-y-1">
              <Dialog>
                <DialogTrigger className="w-full">
                  <div className="flex items-center justify-between w-full gap-4 group cursor-pointer hover:bg-muted rounded-sm p-2">
                    <p className="font-semibold">{task.name}</p>
                    <Maximize2 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </DialogTrigger>
                <TasksDetails taskId={task.id} tasks={tasks} />
              </Dialog>

              <div className="pl-4 space-y-1">
                {taskSubtasksMap[task.id] &&
                taskSubtasksMap[task.id].length > 0 ? (
                  taskSubtasksMap[task.id]
                    .sort(
                      (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    )
                    .map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-2">
                        <TaskStatusIcon status={subtask.status} />
                        <p className="text-sm text-primary/80">
                          {subtask.name}
                        </p>
                      </div>
                    ))
                ) : (
                  <Skeleton className="h-4 w-full" />
                )}
              </div>
            </div>
          ))
      ) : (
        <div className="space-y-4 py-4">
          <Skeleton className="h-6 w-full" />
          <div className="w-full pl-8 space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <Skeleton className="h-6 w-full" />
          <div className="w-full pl-8 space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <Skeleton className="h-6 w-full" />
          <div className="w-full pl-8 space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      )}
    </div>
  );
};
