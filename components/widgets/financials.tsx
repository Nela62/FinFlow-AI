"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { cn } from "@/lib/utils";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchWidgetById } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { metricsDict } from "@/lib/metrics-dict";

export const FinancialsWidget = ({ id }: { id: string }) => {
  const client = createClient();

  const {
    data: widgetData,
    error,
    isLoading,
    // @ts-ignore
  } = useQuery(fetchWidgetById(client, id));

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (error || !widgetData) return null;

  const gridTheme =
    mounted && (theme === "dark" ? "ag-theme-balham-dark" : "ag-theme-balham");

  // @ts-ignore
  const selectedTab = widgetData.config["selectedTab"] ?? "income";
  // @ts-ignore
  const selectedPeriod = widgetData.config["period"] ?? "annual";
  // @ts-ignore
  const data = widgetData.data[selectedPeriod][selectedTab];

  const cleanedData = data.map((item: any) => ({
    ...item,
    metric: metricsDict[item.metric as keyof typeof metricsDict] || item.metric,
  }));

  // Column Definitions: Defines the columns to be displayed.
  const colDefs = [
    { field: "metric" },
    ...Object.keys(data[0])
      .filter((key) => key !== "metric")
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map((key) => ({
        field: key,
      })),
  ];

  return (
    <div className="h-[calc(100%-32px)]">
      <div className={cn("h-full", gridTheme)}>
        <AgGridReact
          rowData={cleanedData}
          columnDefs={colDefs}
          defaultColDef={{ flex: 1 }}
          // gridOptions={{ autoSizeStrategy: { type: "fitGridWidth" } }}
        />
      </div>
    </div>
  );
};
