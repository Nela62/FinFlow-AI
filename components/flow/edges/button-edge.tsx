import { cn } from "@/lib/utils";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
  type Edge,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { X } from "lucide-react";
import { useState } from "react";

type ButtonEdgeData = { isHovered: boolean };

export type ButtonEdge = Edge<ButtonEdgeData>;

export default function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = { stroke: "#3b82f6", strokeWidth: 3, strokeDasharray: "5,5" },
  markerEnd,
  data,
}: EdgeProps<ButtonEdge>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const { setEdges } = useReactFlow();
  const [isVisible, setIsVisible] = useState(false);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    // sourcePosition,
    targetX,
    targetY,
    // targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
    updateNodeInternals(id);
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <button
            className={cn(
              "bg-red-400 rounded-full p-1 transition-opacity duration-200 ease-in-out",
              data?.isHovered ? "opacity-100" : "opacity-0"
            )}
            onClick={onEdgeClick}
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
