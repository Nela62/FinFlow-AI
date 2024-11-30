import { AppNode } from "@/types/node";
import { SEC_FILING_NODE_DEFAULT_DATA } from "./sec-filing";
import { SUMMARIZER_NODE_DEFAULT_DATA } from "./summarizer";

export const defaultDataMap: Record<string, AppNode["data"]> = {
  "sec-filing": SEC_FILING_NODE_DEFAULT_DATA,
  summarizer: SUMMARIZER_NODE_DEFAULT_DATA,
};
