"use client";

import { memo } from "react";
import { useTheme } from "next-themes";

import dynamic from "next/dynamic";

const ForexCrossRatesNoSSR = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.ForexCrossRates),
  {
    ssr: false,
  }
);

function ForexRatesWidget() {
  const { theme } = useTheme();

  return (
    <ForexCrossRatesNoSSR
      colorTheme={theme === "dark" ? "dark" : "light"}
      isTransparent
      autosize
    ></ForexCrossRatesNoSSR>
  );
}

export default memo(ForexRatesWidget);
