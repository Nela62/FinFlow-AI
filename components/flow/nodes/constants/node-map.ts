import { NodeData, NodeHeaderStyle, NodeType } from "@/types/node";
import {
  SEC_FILING_NODE_DEFAULT_DATA,
  SecFilingContent,
} from "../contents/sec-filing-content";
import { Fa6SolidArrowDownWideShort } from "./icons";

export const CONTENT_MAP: Record<
  NodeType,
  React.ComponentType<{ id: string; data: NodeData }>
> = {
  "sec-filing": SecFilingContent,
  summarizer: SummarizerContent,
  "email-sender": EmailSenderContent,
} as const;

export const DEFAULT_DATA_MAP: Record<NodeType, NodeData> = {
  "sec-filing": SEC_FILING_NODE_DEFAULT_DATA,
  summarizer: SUMMARIZER_NODE_DEFAULT_DATA,
  "email-sender": EMAIL_SENDER_NODE_DEFAULT_DATA,
} as const;

export const STYLE_MAP: Record<NodeType, NodeHeaderStyle> = {
  "sec-filing": {
    title: "SEC Filing Parser",
    bgColor: "bg-steel-blue-200",
    textColor: "text-steel-blue-900",
    visual: { type: "image", image: "/nodes/sec-filing.png" },
  },
  summarizer: {
    visual: { type: "icon", Icon: Fa6SolidArrowDownWideShort },
  },
  "email-sender": "bg-steel-blue-200",
} as const;
