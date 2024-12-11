import Image from "next/image";
import { TabType } from "@/stores/sidebarStore";
import { Bot, Home, LucideIcon, Settings, User } from "lucide-react";
import { Button } from "../ui/button";

export type Tab = {
  name: string;
  type: TabType;
  icon: LucideIcon;
  link: string;
};

export const LeftSidebar = () => {
  return (
    <div className="bg-slate-700 h-screen w-fit flex items-center justify-between py-1 flex-col">
      <div className="flex flex-col items-center">
        <Image
          src="/logomark.png"
          alt="logo"
          width={25}
          height={25}
          className="mb-1"
        />
        <Button variant="ghost" size="icon">
          <Home className="w-4 h-4 text-white" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bot className="w-4 h-4 text-white" />
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <Button variant="ghost" size="icon">
          <Settings className="w-4 h-4 text-white" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-4 h-4 text-white" />
        </Button>
      </div>
    </div>
  );
};
