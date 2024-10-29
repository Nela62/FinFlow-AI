"use client";

import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";

function StockScreenerWidget() {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
      "width": "100%",
      "height": "100%",
      "defaultColumn": "overview",
      "defaultScreen": "most_capitalized",
      "showToolbar": true,
      "locale": "en",
      "market": "us",
      "colorTheme": "${theme}"
    }`;

    // Append the script to the container
    container.current?.appendChild(script);
  }, []);

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

export default memo(StockScreenerWidget);
