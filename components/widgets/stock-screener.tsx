"use client";

import { memo } from "react";
import { useTheme } from "next-themes";
import { Stock } from "@/types/panel";

import dynamic from "next/dynamic";

const StockScreenerNoSSR = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.Screener),
  {
    ssr: false,
  }
);

function StockScreenerWidget() {
  const { theme } = useTheme();

  return (
    <StockScreenerNoSSR
      colorTheme={theme === "dark" ? "dark" : "light"}
      autosize
    ></StockScreenerNoSSR>
  );
}

export default memo(StockScreenerWidget);
