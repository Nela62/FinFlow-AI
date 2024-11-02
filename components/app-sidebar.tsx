"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Database,
  Files,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
  SquareDashedKanban,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchAllPanels } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { NavList } from "./nav-list";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = createClient();
  const { data: panels } = useQuery(fetchAllPanels(supabase));

  if (!panels) return null;

  const reports = [];

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Data Sources",
        url: "/data-sources",
        icon: Database,
      },
      {
        title: "Templates",
        url: "/templates",
        icon: SquareDashedKanban,
      },
      {
        title: "Workflows",
        url: "#",
        icon: Bot,
      },
      {
        title: "Panels",
        url: "/panels/new",
        icon: LayoutDashboard,
        addFn: async () => {
          console.log("addFn");
        },
        items:
          panels?.map((panel) => ({
            title: panel.name,
            url: `/panels/${panel.url}`,
            tickers: ["NVDA"],
          })) ?? [],
      },

      {
        title: "Reports",
        url: "#",
        icon: Files,
        addFn: async () => {
          console.log("addFn");
        },
        items: [],
      },
    ],
  };

  // TODO: add a scroll to panels and reports
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
