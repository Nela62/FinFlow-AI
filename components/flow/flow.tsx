"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowInstance,
} from "@xyflow/react";

import { useDebouncedCallback } from "use-debounce";

import "@xyflow/react/dist/style.css";

import { DnDProvider, useDnD } from "./dnd-context";
import Sidebar from "./node-library-sidebar";
import { RunResultsSidebar } from "./run-results-sidebar";
import { defaultDataMap } from "./nodes";
import { Toolbar } from "./toolbar";
import { Dialog } from "../ui/dialog";
import { Popover } from "../ui/popover";
import { createClient } from "@/lib/supabase/client";
import { fetchEdgesByWorkflowId, fetchNodesByWorkflowId } from "@/lib/queries";
import { Skeleton } from "../ui/skeleton";
import { AppNode, CustomEdgeType, edgeTypes, nodeTypes } from "@/types/node";

const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

type Position = z.infer<typeof PositionSchema>;

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

  const fetchNodes = useCallback(async () => {
    const { data: nodesRes } = await fetchNodesByWorkflowId(
      supabase,
      workflowId
    );
    return nodesRes;
  }, [supabase, workflowId]);

  const fetchEdges = useCallback(async () => {
    const { data: edgesRes } = await fetchEdgesByWorkflowId(
      supabase,
      workflowId
    );
    return edgesRes;
  }, [supabase, workflowId]);

  const updateNodes = useDebouncedCallback(async (nodes: AppNode[]) => {
    const { error } = await supabase.from("nodes").upsert(
      nodes.map((node) => ({
        id: node.id,
        name: node.data.label,
        type: node.type ?? "",
        data: node.data,
        position: node.position,
        user_id: userId,
        workflow_id: workflowId,
      }))
    );
    if (error) {
      console.error(error);
    }
  }, 1000);

  const updateEdges = useDebouncedCallback(async (edges: CustomEdgeType[]) => {
    const { error } = await supabase.from("edges").upsert(
      edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type ?? "button-edge",
        source_handle: edge.sourceHandle ?? "",
        target_handle: edge.targetHandle ?? "",
        animated: edge.animated ?? false,
        user_id: userId,
        workflow_id: workflowId,
      }))
    );
    if (error) {
      console.error(error);
    }
  }, 1000);

  const [nodes, setNodes] = useState<AppNode[]>([]);
  const [edges, setEdges] = useState<CustomEdgeType[]>([]);

  useEffect(() => {
    fetchNodes().then((nodesRes) => {
      setNodes(
        nodesRes?.map((node) => ({
          ...node,
          data: node.data as any,
          position: PositionSchema.parse(node.position),
        })) ?? []
      );
    });
  }, [fetchNodes, setNodes]);

  useEffect(() => {
    fetchEdges().then((edgesRes) => {
      setEdges(edgesRes ?? []);
    });
  }, [fetchEdges, setEdges]);

  useEffect(() => {
    updateNodes(nodes);
  }, [nodes, updateNodes]);

  useEffect(() => {
    updateEdges(edges);
  }, [edges, updateEdges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as AppNode[]);
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds) as CustomEdgeType[]);
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (conn: Connection) => {
      setEdges((eds) =>
        addEdge(
          { ...conn, id: uuidv4(), type: "button-edge", animated: true },
          eds
        )
      );
    },
    [setEdges]
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

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, type, setNodes]
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
            <Toolbar workflowId={workflowId} />
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
