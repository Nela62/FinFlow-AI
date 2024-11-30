export const enum DataCategoryEnum {
  Text = "Text",
  Json = "Json",

  // Tabular = "Tabular",
  // File = "File",
  // Any = "Any",
}

export const enum FileFormat {
  JSON = "JSON",
  // CSV = "CSV",
  // XLSX = "XLSX",
  TXT = "TXT",
  MD = "MD",
  // PDF = "PDF",
  // HTML = "HTML",
  // XML = "XML",
  // DOCX = "DOCX",
  // ANY = "ANY",
}

export type DataTypeListItem = {
  type: FileFormat;
  extension: string;
  contentType: string;
  dataCategory: DataCategoryEnum;
  imageLink: string;
};

// Updated list with content types
export const dataTypesList: DataTypeListItem[] = [
  {
    type: FileFormat.JSON,
    extension: ".json",
    contentType: "application/json",
    dataCategory: DataCategoryEnum.Json,
    imageLink: "/output/JSON-file.png",
  },
  // {
  //   name: FileFormat.CSV,
  //   extension: ".csv",
  //   contentType: "text/csv",
  //   formats: [DataCategory.Tabular, DataCategory.Text],
  //   imageLink: "/output/csv-file.png",
  // },
  // {
  //   name: FileFormat.XLSX,
  //   extension: ".xlsx",
  //   contentType:
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   formats: [DataCategory.Tabular],
  //   imageLink: "/output/excel-file.png",
  // },
  {
    type: FileFormat.TXT,
    extension: ".txt",
    contentType: "text/plain",
    dataCategory: DataCategoryEnum.Text,
    imageLink: "/output/txt-file.png",
  },
  {
    type: FileFormat.MD,
    extension: ".md",
    contentType: "text/markdown",
    dataCategory: DataCategoryEnum.Text,
    imageLink: "/output/markdown-file.png",
  },
  // {
  //   name: FileFormat.PDF,
  //   extension: ".pdf",
  //   contentType: "application/pdf",
  //   formats: [DataCategory.PDF],
  //   imageLink: "/output/pdf-file.png",
  // },
  // {
  //   name: FileFormat.HTML,
  //   extension: ".html",
  //   contentType: "text/html",
  //   formats: [DataCategory.Text],
  //   imageLink: "/output/html-file.png",
  // },
  // {
  //   name: FileFormat.XML,
  //   extension: ".xml",
  //   contentType: "application/xml",
  //   formats: [DataCategory.Text],
  //   imageLink: "/output/xml-file.png",
  // },
  // {
  //   name: FileFormat.DOCX,
  //   extension: ".docx",
  //   contentType:
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //   formats: [DataCategory.DOCX],
  //   imageLink: "/output/docx-file.png",
  // },
];
