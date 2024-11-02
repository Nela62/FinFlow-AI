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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = createClient();
  const { data: panels } = useQuery(fetchAllPanels(supabase));

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
        url: "/panels",
        icon: LayoutDashboard,
        isActive: true,
        items:
          panels?.map((panel) => ({
            title: panel.name,
            url: `/panels/${panel.url}`,
          })) ?? [],
      },

      {
        title: "Reports",
        url: "#",
        icon: Files,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Panel 1",
        url: "#",
        icon: Frame,
      },
      {
        name: "Panel 2",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Panel 3",
        url: "#",
        icon: Map,
      },
    ],
    reports: [
      {
        name: "Report 1",
        url: "#",
        icon: Frame,
      },
      {
        name: "Report 2",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Report 3",
        url: "#",
        icon: Map,
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
        {/* <NavList label="Panels" items={data.projects} />
        <NavList label="Reports" items={data.reports} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
