export type Message = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
};
