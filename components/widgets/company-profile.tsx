"use client";

import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";
import { Stock } from "@/types/panel";

// https://www.tradingview.com/widget-docs/widgets/symbol-details/company-profile/
function CompanyProfileWidget({ currentStock }: { currentStock: Stock }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Create container for widget
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    containerRef.current.appendChild(widgetContainer);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "width": "100%",
        "height": "100%",
        "isTransparent": true,
        "colorTheme": "${theme}",
        "symbol": "${currentStock.exchange}:${currentStock.ticker}",
        "locale": "en"
      }`;

    // Create copyright element
    const copyright = document.createElement("div");
    copyright.className = "tradingview-widget-copyright";
    copyright.innerHTML = `
      <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
        <span class="blue-text">Track all markets on TradingView</span>
      </a>
    `;

    // Append elements
    containerRef.current.appendChild(script);
    containerRef.current.appendChild(copyright);

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [theme, currentStock.ticker, currentStock.exchange]);

  return (
    <div className="tradingview-widget-container" ref={containerRef}></div>
  );
}

export default memo(CompanyProfileWidget);
