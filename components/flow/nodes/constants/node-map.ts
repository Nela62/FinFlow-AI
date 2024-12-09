import { NodeHeaderStyle, NodeType } from "@/types/node";
import {
  SEC_FILING_NODE_DEFAULT_DATA,
  SecFilingContent,
} from "../contents/sec-filing-content";
import { Fa6SolidArrowDownWideShort, IconParkOutlineSendEmail } from "./icons";
import {
  SUMMARIZER_NODE_DEFAULT_DATA,
  SummarizerContent,
} from "../contents/summarizer-content";
import {
  EMAIL_SENDER_NODE_DEFAULT_DATA,
  EmailSenderContent,
} from "../contents/email-sender-content";
import { NodeData } from "@/types/react-flow";
import { StockScreenerContent } from "../contents/stock-screener-content";
import { STOCK_SCREENER_NODE_DEFAULT_DATA } from "../contents/stock-screener-content";

export const CONTENT_MAP: Record<
  NodeType,
  React.ComponentType<{
    id: string;
    data: NodeData;
  }>
> = {
  "sec-filing": SecFilingContent,
  summarizer: SummarizerContent,
  "email-sender": EmailSenderContent,
  "stock-screener": StockScreenerContent,
} as const;

export const DEFAULT_DATA_MAP: Record<NodeType, NodeData> = {
  "sec-filing": SEC_FILING_NODE_DEFAULT_DATA,
  summarizer: SUMMARIZER_NODE_DEFAULT_DATA,
  "email-sender": EMAIL_SENDER_NODE_DEFAULT_DATA,
  "stock-screener": STOCK_SCREENER_NODE_DEFAULT_DATA,
} as const;

export const STYLE_MAP: Record<NodeType, NodeHeaderStyle> = {
  "sec-filing": {
    title: "SEC Filing Parser",
    bgColor: "bg-steel-blue-200",
    textColor: "text-steel-blue-900",
    visual: { type: "image", image: "/nodes/sec-filing.png" },
  },
  summarizer: {
    title: "Summarizer",
    bgColor: "bg-orange-200",
    textColor: "text-orange-900",
    visual: {
      type: "icon",
      Icon: Fa6SolidArrowDownWideShort,
      bgColor: "bg-orange-500",
    },
  },
  "email-sender": {
    title: "Email Sender",
    bgColor: "bg-lime-200",
    textColor: "text-lime-900",
    visual: {
      type: "icon",
      Icon: IconParkOutlineSendEmail,
      bgColor: "bg-lime-500",
    },
  },
  "stock-screener": {
    title: "Stock Screener",
    bgColor: "bg-steel-blue-200",
    textColor: "text-steel-blue-900",
    visual: {
      type: "icon",
      Icon: Fa6SolidArrowDownWideShort,
      bgColor: "bg-steel-blue-500",
    },
  },
} as const;
