import { DraggablePanel } from "@/components/dnd/draggable-panel";
import { createClient } from "@/lib/supabase/server";
import { Widget } from "@/types/panel";
import { redirect } from "next/navigation";

export default async function PanelPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch panel data using the id from params
  // const { data: panel, error } = await supabase
  //   .from("panels")
  //   .select("*")
  //   .eq("id", params.id)
  //   .single();

  // if (error || !panel) {
  //   // Handle error or panel not found
  //   return <div>Panel not found or error occurred</div>;
  // }

  // Draggable Widget Component

  // Main Panel Component

  // Sample Widget Components
  const StockChart = () => (
    <div className="p-4 h-full flex items-center justify-center">
      Stock Chart Widget
    </div>
  );

  const FinancialTable = () => (
    <div className="p-4 h-full flex items-center justify-center">
      Financial Table Widget
    </div>
  );

  const handlePanelResize = async (sizes: any) => {
    "use server";

    console.log("Panel sizes changed:", sizes);
  };

  const sampleWidgets: Widget[] = [
    {
      id: "1",
      content: <StockChart />,
      defaultHeight: 400,
      defaultSize: 50,
      className: "bg-slate-800/50",
    },
    {
      id: "2",
      content: <FinancialTable />,
      defaultHeight: 300,
      defaultSize: 50,
      className: "bg-slate-800/50",
    },
  ];

  return (
    <DraggablePanel
      widgets={sampleWidgets}
      handlePanelResize={handlePanelResize}
      className="h-[600px]"
    />
  );
}
