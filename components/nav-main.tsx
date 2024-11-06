"use client";

import { ChevronRight, Plus, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    addFn?: () => Promise<void>;
    items?: {
      title: string;
      url: string;
      tickers: string[];
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Settings</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem className="h-fit max-h-[300px]" key={item.title}>
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.addFn && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-4 w-4"
                    onClick={item.addFn}
                  >
                    <Plus />
                  </Button>
                )}
              </Link>
            </SidebarMenuButton>
            {item.items && item.items.length > 0 && (
              <ScrollArea className="h-full">
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton className="px-1 w-full" asChild>
                        <Link href={subItem.url}>
                          <span className="text-xs font-semibold text-muted-foreground">
                            {subItem.title.length > 20
                              ? subItem.title.slice(0, 20) + "..."
                              : subItem.title}
                          </span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </ScrollArea>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
