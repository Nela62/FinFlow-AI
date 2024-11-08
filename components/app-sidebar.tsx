"use client";

import * as React from "react";
import {
  Bot,
  Database,
  Files,
  GalleryVerticalEnd,
  LayoutDashboard,
  SquareDashedKanban,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  fetchAllPanelsByWorkspaceId,
  fetchAllWorkspaces,
  fetchSettings,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { useSidebarStore } from "@/providers/sidebarStoreProvider";

const AppSidebarComponent = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const supabase = createClient();
  const { data: workspaces } = useQuery(fetchAllWorkspaces(supabase));

  const { workspaceId, setWorkspaceId } = useSidebarStore((state) => state);

  React.useEffect(() => {
    if (workspaces && !workspaceId) {
      setWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, workspaceId]);

  const { data: panels } = useQuery(
    fetchAllPanelsByWorkspaceId(supabase, workspaceId ?? ""),
    {
      enabled: !!workspaceId,
    }
  );
  const { data: settings } = useQuery(fetchSettings(supabase));

  // TODO: This shouldn't be null but rather a skeleton
  if (!panels || !settings) return null;

  const data = {
    user: {
      name: "Name",
      email: settings.email,
      avatar: "",
    },
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
        url: "/workflows",
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
        url: "/reports",
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
        <WorkspaceSwitcher />
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
};

export const AppSidebar = React.memo(AppSidebarComponent);
