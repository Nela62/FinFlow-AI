import { useEffect, useMemo, useState } from "react";
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

// TODO: add icons before each task name
// TODO: add separators between tasks
// TODO: remove padding so separators are full width

const TaskStatusIcon = ({ status }: { status: Task["status"] }) => {
  console.log("status", status);
  switch (status) {
    case "COMPLETED":
      return <CircleCheck className="h-4 w-4 text-primary/80" />;
    case "STARTED":
      return <Loader2 className="h-4 w-4 animate-spin text-primary/80" />;
    case "PENDING":
    default:
      return <CircleDashed className="h-4 w-4 text-primary/80" />;
  }
};

export const RunLogs = () => {
  const { selectedRunId } = useNodesStore((state) => state);
  const [execution, setExecution] = useState<Execution | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  const supabase = createClient();

  // TODO: add a timer showing the time since the task started.

  useEffect(() => {
    if (!selectedRunId) return;

    fetchExecutionById(supabase, selectedRunId).then((res) => {
      if (!res.data) return;

      setExecution({
        id: res.data?.id,
        name: res.data?.name,
        status: res.data?.status,
        startedAt: res.data?.started_at,
        completedAt: res.data?.completed_at,
      });
    });
  }, [selectedRunId]);

  useEffect(() => {
    if (!selectedRunId) return;

    const supabase = createClient();
    fetchAllTasksByExecutionId(supabase, selectedRunId).then((res) => {
      setTasks(
        res.data?.map((t) => ({
          ...t,
          startedAt: t.started_at,
          completedAt: t.completed_at,
          inputValues: t.input_values as IOValue[],
          outputValues: t.output_values as IOValue[],
        })) ?? []
      );
    });
    fetchAllSubtasksByExecutionId(supabase, selectedRunId).then((res) => {
      setSubtasks(
        res.data?.map((t) => ({
          ...t,
          taskId: t.task_id,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
        })) ?? []
      );
    });
  }, [selectedRunId]);

  const taskSubtasksMap = useMemo(() => {
    console.log("subtasks", subtasks);
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

  useEffect(() => {
    console.log("listening to tasks for run ", selectedRunId);
    if (!selectedRunId) return;

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

    if (execution?.status === "COMPLETED") {
      supabase.removeChannel(tasksChannel);
    }

    return () => {
      supabase.removeChannel(tasksChannel);
    };
  }, [selectedRunId, execution?.status]);

  useEffect(() => {
    if (!selectedRunId) return;

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
      )
      .subscribe();

    if (execution?.status === "COMPLETED") {
      supabase.removeChannel(subtasksChannel);
    }

    return () => {
      supabase.removeChannel(subtasksChannel);
    };
  }, [selectedRunId, execution?.status]);

  return (
    <div className="space-y-2 py-2 px-4">
      {tasks
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
              {taskSubtasksMap[task.id]
                ?.sort(
                  (a, b) =>
                    new Date(a.updatedAt).getTime() -
                    new Date(b.updatedAt).getTime()
                )
                .map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <TaskStatusIcon status={subtask.status} />
                    <p className="text-sm text-primary/80">{subtask.name}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};
