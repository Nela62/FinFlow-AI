"use client";

import { useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Background,
  Controls,
  ReactFlow,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { DnDProvider, useDnD } from "./dnd-context";
import Sidebar from "./node-library-sidebar";
import { useNodesStore } from "@/providers/nodesProvider";
import { edgeTypes, nodeTypes } from "@/stores/nodesStore";
import { RunResultsSidebar } from "./run-results-sidebar";
import { defaultDataMap } from "./nodes";

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const { nodes, setNodes, onNodesChange, edges, onEdgesChange, onConnect } =
    useNodesStore((state) => state);

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
      const newNode = {
        id: uuidv4(),
        type,
        position,
        // @ts-ignore
        data: defaultDataMap[type],
      };

      // @ts-ignore
      setNodes([...nodes, newNode]);
    },
    [screenToFlowPosition, type]
  );

  return (
    <div className="h-full w-full">
      <div
        className="h-[calc(100vh-18px)] w-[calc(100vw-70px)]"
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
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar />
      <RunResultsSidebar />
    </div>
  );
};

export const Flow = () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
);
