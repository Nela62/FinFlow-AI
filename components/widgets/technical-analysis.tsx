"use client";

import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchAllWidgetGroups } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { Stock } from "@/types/panel";

function TechnicalAnalysisWidget({ currentStock }: { currentStock: Stock }) {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
			  "autosize": true,
			  "symbol": "${currentStock.exchange}:${currentStock.ticker}",
			  "interval": "D",
			  "support_host": "https://www.tradingview.com",
			  "timezone": "exchange",
			  "theme": "${theme}",
			  "style": "1",
			  "withdateranges": true,
			  "hide_side_toolbar": false,
			  "allow_symbol_change": true,
			  "save_image": false,
			  "studies": [
				"ROC@tv-basicstudies",
				"StochasticRSI@tv-basicstudies",
				"MASimple@tv-basicstudies"
			  ],
			  "show_popup_button": true,
			  "popup_width": "1000",
			  "popup_height": "650"
			}`;

    // Append the script to the container
    container.current?.appendChild(script);
  }, []);

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

export default memo(TechnicalAnalysisWidget);
