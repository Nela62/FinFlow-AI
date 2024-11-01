// menu on the left and top
// main content area in the middle
// tabs with ai chat, pdf viewer on the right

import { AppSidebar } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="px-2 bg-sidebar w-full max-h-screen">
        <Card className="flex-1 my-2 h-[calc(100vh-16px)] flex flex-col w-full">
          <div className="flex items-center gap-2 p-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
          </div>
          <ScrollArea className="">{children}</ScrollArea>
        </Card>
      </div>
    </SidebarProvider>
  );
}
