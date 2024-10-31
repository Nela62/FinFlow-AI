"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { cn } from "@/lib/utils";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import {
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";
import { fetchWidgetById } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { metricsDict } from "@/lib/metrics-dict";
import { Stock } from "@/types/panel";

const fetchDataBasedOnConfig = async (
  financialStatementType: string,
  period: string,
  ticker: string
) => {
  const data = await fetch("/api/metrics", {
    method: "POST",
    body: JSON.stringify({
      symbol: ticker,
      [financialStatementType]: true,
      period,
    }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });

  return data;
};

export const FinancialsWidget = ({
  id,
  currentStock,
}: {
  id: string;
  currentStock: Stock;
}) => {
  const client = createClient();

  const {
    data: widgetData,
    error,
    isLoading,
  } = useQuery(fetchWidgetById(client, id));

  const { mutate: updateWidget } = useUpdateMutation(
    client.from("widgets"),
    ["id"],
    "id"
  );

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const gridTheme =
    mounted && (theme === "dark" ? "ag-theme-balham-dark" : "ag-theme-balham");

  // @ts-ignore
  const selectedTab = widgetData?.config["selectedTab"] ?? "income";
  // @ts-ignore
  const selectedPeriod = widgetData?.config["period"] ?? "annual";
  const data =
    widgetData &&
    widgetData.data &&
    // @ts-ignore
    widgetData.data[selectedPeriod][selectedTab];

  const cleanedData = data?.map((item: any) => ({
    ...item,
    metric: metricsDict[item.metric as keyof typeof metricsDict] || item.metric,
  }));

  // Column Definitions: Defines the columns to be displayed.

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("stock changed");
    // Only refetch if currentStock exists and differs from widget's stock
    if (
      currentStock &&
      widgetData?.widget_groups?.tickers?.symbol !== currentStock.ticker
    ) {
      console.log("fetching data");
      fetchDataBasedOnConfig(selectedTab, selectedPeriod, currentStock.ticker)
        .then((newData) => {
          updateWidget({
            id,
            data: { [selectedPeriod]: newData },
          });
        })
        .catch((error) => {
          console.error("Error fetching widget data:", error);
        });
    }
  }, [currentStock]);

  if (error || !widgetData || !data) return null;

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
