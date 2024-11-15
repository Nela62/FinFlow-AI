export type DataTypeFormat = "Text" | "Tabular" | "PDF" | "JSON" | "DOCX";
export type DataType =
  | "JSON"
  | "CSV"
  | "Excel"
  | "TXT"
  | "MD"
  | "PDF"
  | "HTML"
  | "XML"
  | "DOCX";

export type DataTypeListItem = {
  name: DataType;
  extension: string;
  formats: DataTypeFormat[];
  imageLink: string;
};

export const dataTypesList: DataTypeListItem[] = [
  {
    name: "JSON",
    extension: ".json",
    formats: ["JSON", "Text"],
    imageLink: "",
  },
  {
    name: "CSV",
    extension: ".csv",
    formats: ["Tabular", "Text"],
    imageLink: "",
  },
  { name: "Excel", extension: ".xlsx", formats: ["Tabular"], imageLink: "" },
  { name: "TXT", extension: ".txt", formats: ["Text"], imageLink: "" },
  { name: "MD", extension: ".md", formats: ["Text"], imageLink: "" },
  { name: "PDF", extension: ".pdf", formats: ["PDF"], imageLink: "" },
  { name: "HTML", extension: ".html", formats: ["Text"], imageLink: "" },
  { name: "XML", extension: ".xml", formats: ["Text"], imageLink: "" },
  { name: "DOCX", extension: ".docx", formats: ["DOCX"], imageLink: "" },
];

export type NodeInput = {
  label: string;
  acceptedFormats: DataTypeFormat[];
};

export type NodeOutput = {
  label: string;
  dataTypes: DataType[];
};

export type NodeData = {
  label: string;
  inputs: NodeInput[];
  params: Record<string, any>;
  outputs: NodeOutput[];
  runFn: (params: Record<string, any>) => Promise<Record<string, any>>;
};
