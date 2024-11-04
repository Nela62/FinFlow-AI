import Image from "next/image";

import { useState } from "react";
import { cn } from "@/lib/utils";

const widgets = [
  {
    id: "charting",
    name: "Charting",
    image: "/widgets/charting.png",
    description:
      "An interactive, customizable chart that enables real-time data visualization, technical analysis, and trend tracking for various assets.",
  },
  {
    id: "screener",
    name: "Screener",
    image: "/widgets/screener.png",
    description:
      "A powerful tool for filtering and sorting stocks and forex based on technical and fundamental indicators, aiding in comprehensive market analysis.",
  },
  {
    id: "news",
    name: "News",
    image: "/widgets/news.png",
    description:
      "Provides concise, real-time news updates for crypto and stock markets to keep audiences informed quickly.",
  },
  {
    id: "company_profile",
    name: "Company Profile",
    image: "/widgets/company-profile.png",
    description:
      "Offers a detailed overview of a company's basic information, such as market cap, P/E ratio, and headquarters.",
  },
  {
    id: "economic_calendar",
    name: "Economic Calendar",
    image: "/widgets/economic-calendar.png",
    description:
      "Displays global economic events and announcements, helping users track market-impacting releases.",
  },
  {
    id: "stock_heatmap",
    name: "Stock Heatmap",
    image: "/widgets/stock-heatmap.png",
    description:
      "Visual representation of stock market performance, color-coded for holistic analysis.",
  },
  {
    id: "technical_analysis",
    name: "Technical Analysis",
    image: "/widgets/technical-analysis.png",
    description:
      "Shows technical indicators and trading signals for a chosen stock.",
  },
  {
    id: "fundamental_data",
    name: "Fundamental Data",
    image: "/widgets/fundamental-data.png",
    description:
      "Summarizes fundamental financial data like EPS, dividends, and revenue.",
  },
  {
    id: "symbol_info",
    name: "Symbol Info",
    image: "/widgets/symbol-info.png",
    description:
      "Provides an overview of key data for a specific stock or asset.",
  },
  {
    id: "forex_rates",
    name: "Forex Cross Rates",
    image: "/widgets/forex-rates.png",
    description:
      "Displays current cross-rates for major forex pairs in an easy-to-read format.",
  },
];

export const AddWidgetComponent = ({
  selectedWidgets,
  setSelectedWidgets,
}: {
  selectedWidgets: string[];
  setSelectedWidgets: (widgets: string[]) => void;
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className={cn(
            "border-[1.5px] rounded-md overflow-hidden cursor-pointer",
            selectedWidgets.includes(widget.id)
              ? "border-primary"
              : "border-primary/40"
          )}
          onClick={() => {
            if (selectedWidgets.includes(widget.id)) {
              setSelectedWidgets(
                selectedWidgets.filter((id) => id !== widget.id)
              );
            } else {
              setSelectedWidgets([...selectedWidgets, widget.id]);
            }
          }}
        >
          <div className="flex flex-col items-center justify-center w-fit h-full">
            <div className="relative h-[150px] w-full">
              <Image
                className="border-b border-primary/40"
                src={widget.image}
                alt={widget.name}
                fill
              />
            </div>
            <div className="px-2 py-1.5 flex flex-col gap-1">
              <p className="text-sm font-semibold text-primary/80 text-center">
                {widget.name}
              </p>
              <p className="text-xs text-primary/60">{widget.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
