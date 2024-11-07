"use client";

import { memo } from "react";
import { useTheme } from "next-themes";
import { Stock } from "@/types/panel";

import dynamic from "next/dynamic";

const NewsNoSSR = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.Timeline),
  {
    ssr: false,
  }
);

function NewsWidget({ currentStock }: { currentStock: Stock }) {
  const { theme } = useTheme();

  return (
    <NewsNoSSR
      colorTheme={theme === "dark" ? "dark" : "light"}
      feedMode="symbol"
      symbol={`${currentStock.exchange}:${currentStock.ticker}`}
      isTransparent
      autosize
    ></NewsNoSSR>
  );
}

export default memo(NewsWidget);
