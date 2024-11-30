"use client";

import { useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import {
  Background,
  Controls,
  ReactFlow,
  useReactFlow,
  ReactFlowProvider,
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { DnDProvider, useDnD } from "./dnd-context";
import Sidebar from "./node-library-sidebar";
import { RunResultsSidebar } from "./run-results-sidebar";
import { defaultDataMap } from "./nodes";
import { Toolbar } from "./toolbar";
import { Dialog } from "../ui/dialog";
import { Popover } from "../ui/popover";
import { createClient } from "@/lib/supabase/client";
import {
  useDeleteMutation,
  useInsertMutation,
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";
import { fetchEdgesByWorkflowId, fetchNodesByWorkflowId } from "@/lib/queries";
import { Skeleton } from "../ui/skeleton";
import { AppNode, CustomEdgeType, edgeTypes, nodeTypes } from "@/types/node";

const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

type Position = z.infer<typeof PositionSchema>;

// TODO: add edge and node types

const DnDFlow = ({
  workflowId,
  userId,
}: {
  workflowId: string;
  userId: string;
}) => {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const supabase = createClient();
  // TODO: change from tanstack query to
  const { data: nodesRes } = useQuery(
    fetchNodesByWorkflowId(supabase, workflowId)
  );
  const { data: edgesRes } = useQuery(
    fetchEdgesByWorkflowId(supabase, workflowId)
  );

  const { mutateAsync: insertNodes } = useInsertMutation(
    supabase.from("nodes"),
    ["id"],
    "id"
  );
  const { mutateAsync: updateNodes } = useUpdateMutation(
    supabase.from("nodes"),
    ["id"],
    "id"
  );
  const { mutateAsync: deleteNode } = useDeleteMutation(
    supabase.from("nodes"),
    ["id"],
    "id"
  );

  const { mutateAsync: insertEdges } = useInsertMutation(
    supabase.from("edges"),
    ["id"],
    "id"
  );

  const nodes: AppNode[] =
    nodesRes?.map((node) => ({
      ...node,
      data: node.data as any,
      position: PositionSchema.parse(node.position),
    })) ?? [];

  const edges: CustomEdgeType[] = edgesRes ?? [];

  const onNodesChange = useCallback(
    async (changes: NodeChange[]) => {
      const newNodes: AppNode[] = [];
      const updatedNodes: Partial<AppNode>[] = [];

      changes.forEach((change) => {
        let existingNode;

        switch (change.type) {
          case "position":
            existingNode = nodes.find((node) => node.id === change.id);
            if (!existingNode) return;

            updatedNodes.push({
              id: existingNode.id,
              position: change.position ?? { x: 0, y: 0 },
              dragging: change.dragging,
            });
            break;
          case "select":
            existingNode = nodes.find((node) => node.id === change.id);
            if (!existingNode) return;

            updatedNodes.push({
              id: existingNode.id,
              selected: change.selected,
            });
            break;
          case "remove":
            existingNode = nodes.find((node) => node.id === change.id);
            if (!existingNode) return;

            deleteNode({ id: existingNode.id });
            break;
          case "add":
            const newNode: AppNode = {
              id: uuidv4(),
              user_id: userId,
              workflow_id: workflowId,
              position: change.item.position,
              type: change.item.type,
              data: defaultDataMap[
                change.item.type as keyof typeof defaultDataMap
              ],
            } as AppNode;
            newNodes.push(newNode);
            break;
          case "replace":
            existingNode = nodes.find((node) => node.id === change.id);
            if (!existingNode) return;
            console.log(change.item);

            updatedNodes.push({ ...change.item, id: existingNode.id });
            break;
        }
      });
      // @ts-ignore
      await insertNodes(newNodes);
      // @ts-ignore
      await updateNodes(updatedNodes);
    },
    [nodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      // setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [edges]
  );

  const onConnect = useCallback(
    (conn: Connection) => {
      // setEdges((eds) => addEdge(conn, eds));
    },
    [edges]
  );

  const { updateEdge } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: AppNode = {
        id: uuidv4(),
        // @ts-ignore
        type,
        position,
        // @ts-ignore
        data: defaultDataMap[type],
      };

      insertNodes([newNode]);
    },
    [screenToFlowPosition, type]
  );

  if (!nodes || !edges) return <Skeleton className="w-full h-10" />;

  return (
    <div className="h-full w-full">
      <Dialog>
        <Popover>
          <div
            className="h-[calc(100vh-18px)] w-[calc(100vw-70px)] relative"
            ref={reactFlowWrapper}
          >
            <Toolbar />
            <ReactFlow
              nodes={nodes}
              nodeTypes={nodeTypes}
              edges={edges}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              proOptions={{ hideAttribution: true }}
              onEdgeMouseEnter={(_, edge) => {
                updateEdge(edge.id, (oldEdge) => ({
                  data: { ...oldEdge.data, isHovered: true },
                }));
              }}
              onEdgeMouseLeave={(_, edge) => {
                updateEdge(edge.id, (oldEdge) => ({
                  data: { ...oldEdge.data, isHovered: false },
                }));
              }}
              fitView
            >
              <Background size={2.5} gap={34} />
              <Controls />
            </ReactFlow>
          </div>
          <Sidebar />
          <RunResultsSidebar />
        </Popover>
      </Dialog>
    </div>
  );
};

export const Flow = ({
  workflowId,
  userId,
}: {
  workflowId: string;
  userId: string;
}) => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow workflowId={workflowId} userId={userId} />
    </DnDProvider>
  </ReactFlowProvider>
);
