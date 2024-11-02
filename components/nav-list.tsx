"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";

export function NavList({
  label,
  items,
}: {
  label: string;
  items: {
    name: string;
    url: string;
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden max-h-1/3 h-fit">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        <ScrollArea className="h-full">
          {items.map((item) => (
            <SidebarMenuItem key={item.name} className="">
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </ScrollArea>
      </SidebarMenu>
    </SidebarGroup>
  );
}
