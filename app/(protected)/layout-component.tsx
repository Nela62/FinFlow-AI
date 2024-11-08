"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import Chat from "@/components/chat/chat";
import { Card } from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TopBarAddWidgets } from "@/components/widgets/top-bar-add-widgets";

export const LayoutComponent = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="px-2 bg-sidebar w-full max-h-screen">
        <ResizablePanelGroup direction="horizontal" className="">
          <ResizablePanel defaultSize={75}>
            <Card className="flex-1 my-2 h-[calc(100vh-16px)] flex flex-col w-full">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                  <Separator orientation="vertical" className="h-4" />
                  <Breadcrumbs />
                </div>
                <div className="items-center">
                  <TopBarAddWidgets />
                </div>
              </div>
              <ScrollArea className="">{children}</ScrollArea>
            </Card>
          </ResizablePanel>
          <ResizableHandle className="bg-transparent hover:bg-border mx-2 w-[2px]" />
          <ResizablePanel defaultSize={25}>
            <div className="my-2 h-[calc(100vh-16px)] flex flex-col w-full">
              <Chat />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SidebarProvider>
  );
};
