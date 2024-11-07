"use client";

import { memo } from "react";
import { useTheme } from "next-themes";
import { Stock } from "@/types/panel";

import dynamic from "next/dynamic";

const TechnicalAnalysisNoSSR = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.TechnicalAnalysis),
  {
    ssr: false,
  }
);

function TechnicalAnalysisWidget({ currentStock }: { currentStock: Stock }) {
  const { theme } = useTheme();

  return (
    <TechnicalAnalysisNoSSR
      colorTheme={theme === "dark" ? "dark" : "light"}
      symbol={`${currentStock.exchange}:${currentStock.ticker}`}
      autosize
    ></TechnicalAnalysisNoSSR>
  );
}

export default memo(TechnicalAnalysisWidget);
