import { DataCategory, FileFormat } from "./dataFormat";
import { SVGProps } from "react";

export enum NodeType {
  SEC_FILING = "sec-filing",
  SUMMARIZER = "summarizer",
  EMAIL_SENDER = "email-sender",
}

type NodeInputHandleTrue = {
  hasHandle: "true";
  dataCategory: DataCategory;
  fileFormats: FileFormat[];
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

export type NodeOutput = {
  label: string;
  definition: {
    fileFormats: FileFormat[];
  };
  value: {
    selected: boolean;
  };
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
