"use client";

import { memo } from "react";
import { useTheme } from "next-themes";
import { Stock } from "@/types/panel";

import dynamic from "next/dynamic";

const AdvancedRealTimeChartNoSSR = dynamic(
  () =>
    import("react-ts-tradingview-widgets").then((w) => w.AdvancedRealTimeChart),
  {
    ssr: false,
  }
);

function ChartingWidget({ currentStock }: { currentStock: Stock }) {
  const { theme } = useTheme();

  return (
    <AdvancedRealTimeChartNoSSR
      theme={theme === "dark" ? "dark" : "light"}
      symbol={`${currentStock.exchange}:${currentStock.ticker}`}
      autosize
    ></AdvancedRealTimeChartNoSSR>
  );
}

export default memo(ChartingWidget);
