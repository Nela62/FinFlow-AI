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

const buttonStyle = {
  width: 20,
  height: 20,
  background: "#eee",
  border: "1px solid #fff",
  cursor: "pointer",
  borderRadius: "50%",
  fontSize: "12px",
  lineHeight: 1,
};

type ButtonEdgeData = {};

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
}: EdgeProps<ButtonEdge>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const { setEdges } = useReactFlow();
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
          <button style={buttonStyle} onClick={onEdgeClick}>
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
