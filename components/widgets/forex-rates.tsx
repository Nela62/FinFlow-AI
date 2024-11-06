"use client";

import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";
import { Stock } from "@/types/panel";

// https://www.tradingview.com/widget-docs/widgets/heatmaps/forex-cross-rates/
function ForexRatesWidget({ currentStock }: { currentStock: Stock }) {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "width": "100%",
          "height": "100%",
          "currencies": [
            "EUR",
            "USD",
            "JPY",
            "GBP",
            "CHF",
            "AUD",
            "CAD",
            "NZD"
          ],
          "isTransparent": true,
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
  }, [currentStock, theme]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
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

export default memo(ForexRatesWidget);
