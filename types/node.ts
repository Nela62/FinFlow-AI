import { DataCategory, FileFormat } from "./dataFormat";
import { SVGProps } from "react";

export enum NodeType {
  SEC_FILING = "sec-filing",
  SUMMARIZER = "summarizer",
  EMAIL_SENDER = "email-sender",
  STOCK_SCREENER = "stock-screener",
  API_CONNECTOR = "api-connector",
  APPENDER = "appender",
  DCF_MODEL = "dcf-model",
  // FINANCIAL_ANALYSIS = "financial-analysis",
  DOCUMENT_COMPILER = "document-compiler",
}

type NodeInputHandleTrue = {
  hasHandle: "true";
  dataCategory: DataCategory;
  fileFormats: FileFormat[];
  isList: boolean;
  dynamic: boolean;
};

type NodeInputHandleFalse = {
  hasHandle: "false";
};

export type NodeInputHandle = NodeInputHandleTrue | NodeInputHandleFalse;

export type NodeInput = {
  label: string;
  handle: NodeInputHandle;
  value?: any;
};

export type SupportedFileFormat = {
  fileFormat: FileFormat;
  value: { selected: boolean };
};

export type NodeOutput = {
  label: string;
  allowMultiple: boolean;
  supportedFileFormats: SupportedFileFormat[];
  isList: boolean;
};

export type NodeContent = React.ReactNode;

type NodeVisual =
  | {
      type: "icon";
      Icon: React.FC<SVGProps<SVGSVGElement>>;
      bgColor: string;
    }
  | {
      type: "image";
      image: string;
    };

export type NodeHeaderStyle = {
  title: string;
  bgColor: string;
  textColor: string;
  visual: NodeVisual;
};
