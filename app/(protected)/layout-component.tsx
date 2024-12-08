"use client";

import { LeftSidebar } from "@/components/sidebar/left-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Bot } from "lucide-react";

export const LayoutComponent = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) => {
  return (
    <SidebarProvider className="flex">
      {/* <AppSidebar /> */}
      <LeftSidebar />
      <div className="bg-sidebar w-full max-h-screen relative grow">
        <div className="w-full h-[35px] bg-slate-700 z-40">
          <Button variant="ghost" size="icon">
            <Bot className="w-4 h-4 text-white" />
          </Button>
        </div>
        <div className="relative h-[calc(100vh-35px)] w-full bg-slate-700">
          {children}
        </div>
        {/* <ResizablePanelGroup direction="horizontal" className="">
          <ResizablePanel defaultSize={75}>
            <Card className="flex-1 my-2 h-[calc(100vh-16px)] flex flex-col w-full">
              {!isWorkflowsPage ? (
                <>
                  <div
                    className={cn(
                      "flex items-center justify-between p-2",
                      isWorkflowsPage && "bg-transparent"
                    )}
                  >
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
                </>
              ) : (
                <div className="relative">{children}</div>
              )}
            </Card>
          </ResizablePanel>
          {!isWorkflowsPage && (
            <>
              <ResizableHandle className="bg-transparent hover:bg-border mx-2 w-[2px]" />
              <ResizablePanel defaultSize={25}>
                <div className="my-2 h-[calc(100vh-16px)] flex flex-col w-full">
                  <Chat />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup> */}
      </div>
    </SidebarProvider>
  );
};
