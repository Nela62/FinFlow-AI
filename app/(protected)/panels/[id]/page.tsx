import { createClient } from "@/lib/supabase/server";
import { Widget } from "@/types/panel";
import { redirect } from "next/navigation";
import { Panel } from "./components/panel";
import { Card, CardContent } from "@/components/ui/card";
import TechnicalAnalysisWidget from "@/components/widgets/technical-analysis";

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
    <div className="p-4 h-full">
      <div className="text-xl font-semibold text-zinc-200 mb-2">$483.72</div>
      <div className="text-sm text-green-500">+0.85 (+0.18%)</div>
      <div className="text-xs text-zinc-400 mt-1">Volume: 2.407M</div>
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
      title: "Stock Chart",
      content: <StockChart />,
      position: { x: 0, y: 0, w: 6, h: 4 },
    },
    {
      id: "2",
      title: "Technical Analysis",
      content: <TechnicalAnalysisWidget />,
      position: { x: 6, y: 0, w: 6, h: 10 },
    },
    // {
    //   id: "2",
    //   type: "FinancialTable",
    //   props: {},
    //   position: { x: 0, y: 0, w: 1, h: 1 },
    // },
    // {
    //   id: "3",
    //   type: "FinancialTable",
    //   props: {},
    //   position: { x: 0, y: 0, w: 1, h: 1 },
    // },
  ];

  return <Panel widgets={sampleWidgets} />;
}
