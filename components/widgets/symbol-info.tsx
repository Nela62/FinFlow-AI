"use client";

import { memo } from "react";
import { useTheme } from "next-themes";
import { Stock } from "@/types/panel";

import dynamic from "next/dynamic";

const SymbolInfoNoSSR = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.SymbolInfo),
  {
    ssr: false,
  }
);

function SymbolInfoWidget({ currentStock }: { currentStock: Stock }) {
  const { theme } = useTheme();

  return (
    <SymbolInfoNoSSR
      colorTheme={theme === "dark" ? "dark" : "light"}
      symbol={`${currentStock.exchange}:${currentStock.ticker}`}
      autosize
    ></SymbolInfoNoSSR>
  );
}

export default memo(SymbolInfoWidget);
