"use client";

import { memo } from "react";
import { useTheme } from "next-themes";
import { Stock } from "@/types/panel";

import dynamic from "next/dynamic";

const CompanyProfileNoSSR = dynamic(
  () => import("react-ts-tradingview-widgets").then((w) => w.CompanyProfile),
  {
    ssr: false,
  }
);

function CompanyProfileWidget({ currentStock }: { currentStock: Stock }) {
  const { theme } = useTheme();

  return (
    <CompanyProfileNoSSR
      colorTheme={theme === "dark" ? "dark" : "light"}
      symbol={`${currentStock.exchange}:${currentStock.ticker}`}
      isTransparent
      autosize
    ></CompanyProfileNoSSR>
  );
}

export default memo(CompanyProfileWidget);
