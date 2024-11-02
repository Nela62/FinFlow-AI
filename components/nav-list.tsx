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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
    id: string;
    name: string;
    url: string;
    tickers: string[];
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden max-h-1/3 h-fit">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        <ScrollArea className="h-full">
          <SidebarMenuSub>
            {items.map((item) => (
              <SidebarMenuSubItem key={item.name}>
                <SidebarMenuSubButton className="px-1 w-full" asChild>
                  <Link href={item.url}>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {item.name.length > 20
                        ? item.name.slice(0, 20) + "..."
                        : item.name}
                    </span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </ScrollArea>
      </SidebarMenu>
    </SidebarGroup>
  );
}
