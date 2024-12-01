import { FileFormat, DataCategory, FileFormatData } from "@/types/dataFormat";

export const FILE_FORMAT_MAP: Record<FileFormat, FileFormatData> = {
  [FileFormat.JSON]: {
    extension: ".json",
    contentType: "application/json",
    dataCategory: DataCategory.Json,
    imageLink: "/output/JSON-file.png",
  },
  [FileFormat.TXT]: {
    extension: ".txt",
    contentType: "text/plain",
    dataCategory: DataCategory.Text,
    imageLink: "/output/txt-file.png",
  },
  [FileFormat.MD]: {
    extension: ".md",
    contentType: "text/markdown",
    dataCategory: DataCategory.Text,
    imageLink: "/output/markdown-file.png",
  },
};

// export const fileFormatsList: FileFormatData[] = [

//   // {
//   //   name: FileFormat.CSV,
//   //   extension: ".csv",
//   //   contentType: "text/csv",
//   //   formats: [DataCategory.Tabular, DataCategory.Text],
//   //   imageLink: "/output/csv-file.png",
//   // },
//   // {
//   //   name: FileFormat.XLSX,
//   //   extension: ".xlsx",
//   //   contentType:
//   //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   //   formats: [DataCategory.Tabular],
//   //   imageLink: "/output/excel-file.png",
//   // },
//   {
//     type: FileFormat.TXT,
//     extension: ".txt",
//     contentType: "text/plain",
//     dataCategory: DataCategory.Text,
//     imageLink: "/output/txt-file.png",
//   },
//   {
//     type: FileFormat.MD,
//     extension: ".md",
//     contentType: "text/markdown",
//     dataCategory: DataCategory.Text,
//     imageLink: "/output/markdown-file.png",
//   },
//   // {
//   //   name: FileFormat.PDF,
//   //   extension: ".pdf",
//   //   contentType: "application/pdf",
//   //   formats: [DataCategory.PDF],
//   //   imageLink: "/output/pdf-file.png",
//   // },
//   // {
//   //   name: FileFormat.HTML,
//   //   extension: ".html",
//   //   contentType: "text/html",
//   //   formats: [DataCategory.Text],
//   //   imageLink: "/output/html-file.png",
//   // },
//   // {
//   //   name: FileFormat.XML,
//   //   extension: ".xml",
//   //   contentType: "application/xml",
//   //   formats: [DataCategory.Text],
//   //   imageLink: "/output/xml-file.png",
//   // },
//   // {
//   //   name: FileFormat.DOCX,
//   //   extension: ".docx",
//   //   contentType:
//   //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   //   formats: [DataCategory.DOCX],
//   //   imageLink: "/output/docx-file.png",
//   // },
// ];
