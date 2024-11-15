import {
  SecFilingNode,
  type SecFilingNodeType,
  defaultData as secFilingDefaultData,
} from "@/components/flow/nodes/sec-filing";
import {
  ApiConnectorNode,
  type ApiConnectorNode as ApiConnectorNodeType,
  defaultData as apiConnectorDefaultData,
} from "@/components/flow/nodes/api-connector";
import {
  SwitchNode,
  type SwitchNode as SwitchNodeType,
  defaultData as switchDefaultData,
} from "@/components/flow/nodes/switch";
import ButtonEdge, {
  type ButtonEdge as ButtonEdgeType,
} from "@/components/flow/edges/button-edge";
import {
  defaultData as summarizerDefaultData,
  SummarizerNode,
  type SummarizerNode as SummarizerNodeType,
} from "@/components/flow/nodes/summarizer";
import {
  DcfModelNode,
  DcfModelNodeType,
  defaultData as dcfModelDefaultData,
} from "@/components/flow/nodes/dcf-model";
import {
  AppenderNode,
  AppenderNodeType,
  defaultData as appenderDefaultData,
} from "@/components/flow/nodes/appender";
import {
  DocumentCompilerNode,
  DocumentCompilerNodeType,
  defaultData as documentCompilerDefaultData,
} from "@/components/flow/nodes/document-compiler";
import {
  EmailSenderNode,
  EmailSenderNodeType,
  defaultData as emailSenderDefaultData,
} from "@/components/flow/nodes/email-sender";
import { defaultData as financialAnalysisDefaultData } from "@/components/flow/nodes/financial-analysis";
import { dataTypesList, NodeRunResult, RunResults } from "@/types/node";

export const defaultDataMap = {
  "api-connector": apiConnectorDefaultData,
  "sec-filing": secFilingDefaultData,
  "dcf-model": dcfModelDefaultData,
  appender: appenderDefaultData,
  "document-compiler": documentCompilerDefaultData,
  "email-sender": emailSenderDefaultData,
  "financial-analysis": financialAnalysisDefaultData,
  switch: switchDefaultData,
  summarizer: summarizerDefaultData,
};
