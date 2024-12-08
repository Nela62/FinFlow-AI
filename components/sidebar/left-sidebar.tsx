import Image from "next/image";
import { TabType } from "@/stores/sidebarStore";
import { Bot, Home, LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

export type Tab = {
  name: string;
  type: TabType;
  icon: LucideIcon;
  link: string;
};

export const LeftSidebar = () => {
  return (
    <div className="bg-slate-700 h-screen w-fit flex items-center py-2 flex-col">
      <Image src="/logomark.png" alt="logo" width={25} height={25} />
      <Button variant="ghost" size="icon">
        <Home className="w-4 h-4 text-white" />
      </Button>
      <Button variant="ghost" size="icon">
        <Bot className="w-4 h-4 text-white" />
      </Button>
    </div>
  );
};
