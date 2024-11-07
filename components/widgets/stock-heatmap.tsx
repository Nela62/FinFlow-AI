"use client";

import { memo } from "react";
import { useTheme } from "next-themes";
import { Stock } from "@/types/panel";

import dynamic from "next/dynamic";

const StockHeatmapNoSSR = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.StockHeatmap),
  {
    ssr: false,
  }
);

function StockHeatmapWidget() {
  const { theme } = useTheme();

  return (
    <StockHeatmapNoSSR
      colorTheme={theme === "dark" ? "dark" : "light"}
      autoSize
    ></StockHeatmapNoSSR>
  );
}

export default memo(StockHeatmapWidget);
