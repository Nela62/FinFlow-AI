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

type FinancialsWidgetData = {
  [key: string]: Record<string, string | number>[];
};

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

  const selectedTab =
    (widgetData.config &&
      typeof widgetData.config === "object" &&
      "selectedTab" in widgetData.config &&
      widgetData.config["selectedTab"]) ??
    "income";

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<ColDef[]>(
    Object.keys(widgetData.data[selectedTab][0]).map((key) => ({ field: key }))
  );

  return (
    <div className={cn("h-full", gridTheme)}>
      <AgGridReact
        rowData={widgetData.data[selectedTab]}
        columnDefs={colDefs}
      />
    </div>
  );
};
