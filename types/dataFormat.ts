export const enum DataCategory {
  Text = "Text",
  Json = "Json",
  Tabular = "Tabular",
  PDF = "PDF",
  // Tabular = "Tabular",
  // File = "File",
  // Any = "Any",
}

export const enum FileFormat {
  JSON = "JSON",
  CSV = "CSV",
  // XLSX = "XLSX",
  TXT = "TXT",
  MD = "MD",
  PDF = "PDF",
  // HTML = "HTML",
  // XML = "XML",
  // DOCX = "DOCX",
  // ANY = "ANY",
}

export type FileFormatData = {
  extension: string;
  contentType: string;
  dataCategory: DataCategory;
  imageLink: string;
};
