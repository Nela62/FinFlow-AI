"use client";

import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";
import { Stock } from "@/types/panel";

// TODO: add ability to view all symbols and by market
// https://www.tradingview.com/widget-docs/widgets/news/top-stories/
function NewsWidget({ currentStock }: { currentStock: Stock }) {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "feedMode": "symbol",
        "symbol": "${currentStock.exchange}:${currentStock.ticker}",
        "isTransparent": true,
        "displayMode": "regular",
        "width": "100%",
        "height": "100%",
        "colorTheme": "${theme}",
        "locale": "en"
      }`;

    // Append the script to the container
    container.current?.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [theme, currentStock]);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(NewsWidget);
