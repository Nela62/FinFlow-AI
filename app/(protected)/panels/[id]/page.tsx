import { createClient } from "@/lib/supabase/server";
import { Widget } from "@/types/panel";
import { redirect } from "next/navigation";
import { Panel } from "./components/panel";
import { Card, CardContent } from "@/components/ui/card";
import TechnicalAnalysisWidget from "@/components/widgets/technical-analysis";
import StockScreenerWidget from "@/components/widgets/stock-screener";
import { FinancialsWidget } from "@/components/widgets/financials";
import { fetchAllWidgets } from "@/lib/queries";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";

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
    return redirect("/login");
  }

  const queryClient = new QueryClient();

  await prefetchQuery(queryClient, fetchAllWidgets(supabase, params.id));

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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Panel panelUrl={params.id} userId={user.id} />
    </HydrationBoundary>
  );
}
