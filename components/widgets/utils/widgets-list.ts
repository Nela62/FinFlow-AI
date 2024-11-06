import React from "react";
import { FundamentalDataWidget } from "../fundamental-data";
import ChartingWidget from "../charting";
import CompanyProfileWidget from "../company-profile";
import EconomicCalendarWidget from "../economic-calendar";
import ForexRatesWidget from "../forex-rates";
import NewsWidget from "../news";
import StockScreenerWidget from "../stock-screener";
import StockHeatmapWidget from "../stock-heatmap";
import SymbolInfoWidget from "../symbol-info";
import TechnicalAnalysisWidget from "../technical-analysis";

export type Widget = {
  id: string;
  name: string;
  image: string;
  component: React.ComponentType<any>;
  description: string;
  defaultConfig: Record<string, any>;
  height: number;
  width: number;
};

export const widgetsList: Widget[] = [
  {
    id: "charting",
    name: "Charting",
    image: "/widgets/charting.png",
    component: ChartingWidget,
    description:
      "An interactive, customizable chart that enables real-time data visualization, technical analysis, and trend tracking for various assets.",
    defaultConfig: {},
    height: 10,
    width: 30,
  },
  {
    id: "screener",
    name: "Screener",
    image: "/widgets/screener.png",
    component: StockScreenerWidget,
    description:
      "A powerful tool for filtering and sorting stocks and forex based on technical and fundamental indicators, aiding in comprehensive market analysis.",
    defaultConfig: {},
    height: 10,
    width: 30,
  },
  {
    id: "news",
    name: "News",
    image: "/widgets/news.png",
    component: NewsWidget,
    description:
      "Provides concise, real-time news updates for crypto and stock markets to keep audiences informed quickly.",
    defaultConfig: {},
    height: 10,
    width: 30,
  },
  {
    id: "company_profile",
    name: "Company Profile",
    image: "/widgets/company-profile.png",
    component: CompanyProfileWidget,
    description:
      "Offers a detailed overview of a company's basic information, such as market cap, P/E ratio, and headquarters.",
    defaultConfig: {},
    height: 10,
    width: 30,
  },
  {
    id: "economic_calendar",
    name: "Economic Calendar",
    image: "/widgets/economic-calendar.png",
    component: EconomicCalendarWidget,
    description:
      "Displays global economic events and announcements, helping users track market-impacting releases.",
    defaultConfig: {},
    height: 10,
    width: 30,
  },
  {
    id: "stock_heatmap",
    name: "Stock Heatmap",
    image: "/widgets/stock-heatmap.png",
    component: StockHeatmapWidget,
    description:
      "Visual representation of stock market performance, color-coded for holistic analysis.",
    defaultConfig: {},
    height: 10,
    width: 30,
  },
  {
    id: "technical_analysis",
    name: "Technical Analysis",
    image: "/widgets/technical-analysis.png",
    component: TechnicalAnalysisWidget,
    description:
      "Shows technical indicators and trading signals for a chosen stock.",
    defaultConfig: {},
    height: 10,
    width: 30,
  },
  {
    id: "fundamental_data",
    name: "Fundamental Data",
    image: "/widgets/fundamental-data.png",
    component: FundamentalDataWidget,
    description:
      "Summarizes fundamental financial data like EPS, dividends, and revenue.",
    defaultConfig: { selectedTab: "income", period: "annual" },
    height: 10,
    width: 30,
  },
  {
    id: "symbol_info",
    name: "Symbol Info",
    image: "/widgets/symbol-info.png",
    component: SymbolInfoWidget,
    description:
      "Provides an overview of key data for a specific stock or asset.",
    defaultConfig: {},
    height: 10,
    width: 30,
  },
  {
    id: "forex_rates",
    name: "Forex Cross Rates",
    image: "/widgets/forex-rates.png",
    component: ForexRatesWidget,
    description:
      "Displays current cross-rates for major forex pairs in an easy-to-read format.",
    defaultConfig: {},
    height: 10,
    width: 30,
  },
];
