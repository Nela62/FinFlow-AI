import { FileFormat } from "./dataFormat";

export type IOValue = {
  label: string;
  value: any;
  // fileFormat: FileFormat;
};

export type Run = {
  id: string;
  name: string;
  status: string;
};

export type Task = {
  id: string;
  name: string;
  status: string;
  inputValues: IOValue[];
  outputValues: IOValue[];
  startedAt: string;
  completedAt: string | null;
};

export type Subtask = {
  id: string;
  taskId: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Execution = {
  id: string;
  name: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
};
