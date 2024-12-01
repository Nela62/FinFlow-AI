import { NodeHeaderStyle, NodeType } from "@/types/node";
import { SecFilingContent } from "../contents/sec-filing-content";

export const contentMap: Record<NodeType, React.ComponentType> = {
  "sec-filing": SecFilingContent,
  summarizer: SummarizerContent,
  "email-sender": EmailSenderContent,
} as const;

export const styleMap: Record<NodeType, NodeHeaderStyle> = {
  "sec-filing": {
    title: "SEC Filing Parser",
    bgColor: "bg-steel-blue-200",
    textColor: "text-steel-blue-900",
    visual: { type: "image", image: "/nodes/sec-filing.png" },
  },
  summarizer: "bg-steel-blue-200",
  "email-sender": "bg-steel-blue-200",
} as const;
