import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Task } from "@/types/run";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import React, { useState } from "react";
import { useMemo } from "react";

export const TasksDetails = ({
  taskId,
  tasks,
}: {
  taskId: string;
  tasks: Task[];
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(taskId);

  const task = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId),
    [selectedTaskId, tasks]
  );

  return (
    <DialogContent className="p-0 m-0 h-[80vh] w-[80vw] overflow-hidden border-none">
      <VisuallyHidden.Root>
        <DialogHeader>
          <DialogTitle>Run Details</DialogTitle>
        </DialogHeader>
      </VisuallyHidden.Root>
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] divide-x divide-y">
        <div className="h-fit px-4 py-3 flex items-center">
          <p className="font-semibold">All tasks</p>
        </div>
        <div className="h-fit px-4 py-3 flex items-center">
          <p className="font-semibold">Task Details</p>
        </div>
        <div className="h-full space-y-1 p-2">
          {tasks
            .sort(
              (a, b) =>
                new Date(a.startedAt).getTime() -
                new Date(b.startedAt).getTime()
            )
            .map((task) => (
              <React.Fragment key={task.id}>
                <div
                  className="flex items-center gap-6 justify-between hover:bg-muted p-2 rounded-sm cursor-pointer"
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  <p>{task.name}</p>
                  <p
                    className={cn(
                      "text-xs text-muted-foreground capitalize",
                      task.status === "COMPLETED" && "text-green-600",
                      task.status === "FAILED" && "text-red-600",
                      task.status === "STARTED" && "text-yellow-600",
                      task.status === "PENDING" && "text-gray-600"
                    )}
                  >
                    {task.status.toLowerCase()}
                  </p>
                </div>
                <Separator orientation="horizontal" />
              </React.Fragment>
            ))}
        </div>
        <div className="h-full">Tasks Details</div>
      </div>
    </DialogContent>
  );
};
