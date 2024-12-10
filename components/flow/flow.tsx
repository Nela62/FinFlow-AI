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
} from "@xyflow/react";

import { useDebouncedCallback } from "use-debounce";

import "@xyflow/react/dist/style.css";

import { DnDProvider, useDnD } from "./dnd-context";
import { NodeLibrarySidebar } from "./node-library-sidebar";
import { Toolbar } from "./toolbar";
import { Dialog } from "../ui/dialog";
import { Popover } from "../ui/popover";
import { createClient } from "@/lib/supabase/client";
import { fetchEdgesByWorkflowId, fetchNodesByWorkflowId } from "@/lib/queries";
import { Skeleton } from "../ui/skeleton";
import {
  AppNode,
  CustomEdgeType,
  edgeTypes,
  NodeData,
  nodeTypes,
} from "@/types/react-flow";
import { DEFAULT_DATA_MAP } from "./nodes/constants/node-map";
import { RunsSidebar } from "./runs/runs-sidebar";
import { useNodesStore } from "@/providers/nodesProvider";

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

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
  } = useNodesStore((state) => state);

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
        name: node.data.title,
        type: "app-node",
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

  useEffect(() => {
    fetchNodes().then((nodesRes) => {
      setNodes(
        nodesRes?.map((node) => ({
          ...node,
          type: "app-node",
          data: node.data as NodeData,
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

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: AppNode = {
        id: uuidv4(),
        type: "app-node",
        position,
        // @ts-ignore
        data: DEFAULT_DATA_MAP[type],
      };

      addNode(newNode);
    },
    [screenToFlowPosition, type, setNodes]
  );

  if (!nodes || !edges) return <Skeleton className="w-full h-10" />;

  return (
    <div className="h-full w-full">
      <Dialog>
        <Popover>
          <div
            className="h-full w-full relative bg-slate-200 rounded-tl-[5px]"
            ref={reactFlowWrapper}
          >
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
              defaultViewport={{ x: 200, y: 100, zoom: 0.7 }}
            >
              <Background size={1} gap={20} />
              {/* <Controls /> */}
            </ReactFlow>
          </div>
          <div className="flex absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
            <NodeLibrarySidebar />
            <Toolbar workflowId={workflowId} />
            <RunsSidebar workflowId={workflowId} />
          </div>
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
