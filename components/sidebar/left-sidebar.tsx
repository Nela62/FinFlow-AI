import { TabType } from "@/stores/sidebarStore";
import { Bot, LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

export type Tab = {
  name: string;
  type: TabType;
  icon: LucideIcon;
  link: string;
};

export const LeftSidebar = () => {
  return (
    <div className="bg-slate-700 h-screen w-fit">
      <Button variant="ghost" size="icon">
        <Bot className="w-4 h-4 text-white" />
      </Button>
    </div>
  );
};
