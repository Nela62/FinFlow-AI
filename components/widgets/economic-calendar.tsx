"use client";

import { memo } from "react";
import { useTheme } from "next-themes";

import dynamic from "next/dynamic";

const EconomicCalendarNoSSR = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.EconomicCalendar),
  {
    ssr: false,
  }
);

function EconomicCalendarWidget() {
  const { theme } = useTheme();

  return (
    <EconomicCalendarNoSSR
      colorTheme={theme === "dark" ? "dark" : "light"}
      isTransparent
      autosize
    ></EconomicCalendarNoSSR>
  );
}

export default memo(EconomicCalendarWidget);
