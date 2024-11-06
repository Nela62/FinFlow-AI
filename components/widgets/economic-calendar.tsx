"use client";

import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";
import { Stock } from "@/types/panel";

// TODO: add a filter by country
// https://www.tradingview.com/widget-docs/widgets/calendars/economic-calendar/
function EconomicCalendarWidget() {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "width": "100%",
        "height": "100%",
        "colorTheme": "${theme}",
        "isTransparent": true,
        "locale": "en",
        "importanceFilter": "-1,0,1",
        "countryFilter": "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu"
      }`;

    // Append the script to the container
    container.current?.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [theme]);

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

export default memo(EconomicCalendarWidget);
