import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Task } from "@/types/run";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import React, { useState } from "react";
import { useMemo } from "react";
import { DisplayContent } from "./display-content";
import { Accordion } from "@/components/ui/accordion";

// FIXME: Move the cross icon lower
// FIXME: Fix the accordion default value

export const TasksDetails = ({
  taskId,
  tasks,
}: {
  taskId: string;
  tasks: Task[];
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(taskId);
  const [tab, setTab] = useState<"outputs" | "inputs">("outputs");

  const task = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId),
    [selectedTaskId, tasks]
  );

  return (
    <DialogContent className="p-0 m-0 h-[90vh] w-[70vw] max-w-none overflow-hidden border-none">
      <VisuallyHidden.Root>
        <DialogHeader>
          <DialogTitle>Run Details</DialogTitle>
        </DialogHeader>
      </VisuallyHidden.Root>
      <Tabs defaultValue={tab}>
        <div className="h-full grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] divide-x">
          <div className="px-4 py-3 flex items-center border-b h-[65px] w-[250px]">
            <p className="font-semibold">All tasks</p>
          </div>
          <div className="px-4 py-3 flex items-center justify-between border-b pr-14 h-[65px]">
            <p className="font-semibold">{task?.name}</p>
            <TabsList className="">
              <TabsTrigger value="outputs" onClick={() => setTab("outputs")}>
                Outputs
              </TabsTrigger>
              <TabsTrigger value="inputs" onClick={() => setTab("inputs")}>
                Inputs
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="h-full w-[250px]">
            {tasks
              .sort(
                (a, b) =>
                  new Date(a.startedAt).getTime() -
                  new Date(b.startedAt).getTime()
              )
              .map((task) => (
                <React.Fragment key={task.id}>
                  <div
                    className={cn(
                      "flex items-center gap-6 justify-between hover:bg-slate-100 py-4 px-4 cursor-pointer",
                      selectedTaskId === task.id && "bg-slate-50"
                    )}
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    <p className="text-sm">{task.name}</p>
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
          <div className="flex flex-col h-full">
            <TabsContent
              value="outputs"
              className="max-h-[calc(90vh-65px)] mt-0"
            >
              <Accordion
                type="single"
                collapsible
                className="h-full flex flex-col"
                defaultValue={task?.outputValues[0]?.label}
              >
                {task?.outputValues.map((value) => (
                  <DisplayContent
                    key={value.label}
                    name={value.label}
                    content={value.value}
                  />
                ))}
              </Accordion>
            </TabsContent>
            <TabsContent
              value="inputs"
              className="max-h-[calc(90vh-65px)] mt-0"
            >
              <Accordion
                type="single"
                collapsible
                className="h-full flex flex-col"
                defaultValue={task?.inputValues[0]?.label}
              >
                {task?.inputValues.map((value) => (
                  <DisplayContent
                    key={value.label}
                    name={value.label}
                    content={value.value}
                  />
                ))}
              </Accordion>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </DialogContent>
  );
};
