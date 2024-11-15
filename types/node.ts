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
    imageLink: "/output/JSON-file.png",
  },
  {
    name: "CSV",
    extension: ".csv",
    formats: ["Tabular", "Text"],
    imageLink: "/output/csv-file.png",
  },
  {
    name: "Excel",
    extension: ".xlsx",
    formats: ["Tabular"],
    imageLink: "/output/excel-file.png",
  },
  {
    name: "TXT",
    extension: ".txt",
    formats: ["Text"],
    imageLink: "/output/txt-file.png",
  },
  {
    name: "MD",
    extension: ".md",
    formats: ["Text"],
    imageLink: "/output/markdown-file.png",
  },
  {
    name: "PDF",
    extension: ".pdf",
    formats: ["PDF"],
    imageLink: "/output/pdf-file.png",
  },
  {
    name: "HTML",
    extension: ".html",
    formats: ["Text"],
    imageLink: "/output/html-file.png",
  },
  {
    name: "XML",
    extension: ".xml",
    formats: ["Text"],
    imageLink: "/output/xml-file.png",
  },
  {
    name: "DOCX",
    extension: ".docx",
    formats: ["DOCX"],
    imageLink: "/output/docx-file.png",
  },
];

export type NodeInput = {
  label: string;
  acceptedFormats: DataTypeFormat[];
};

export type NodeOutput = {
  label: string;
  dataType: DataType;
};

export type NodeData = {
  label: string;
  inputs: NodeInput[];
  params: Record<string, any>;
  outputs: NodeOutput[];
  runFn: (params: Record<string, any>) => Promise<Record<string, any>>;
};
