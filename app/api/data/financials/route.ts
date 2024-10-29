import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const cleanRes = (res: any) => {
  let data = {
    income: <any>[],
    balance: <any>[],
    cash: <any>[],
    metrics: <any>[],
  };

  Object.keys(res).forEach((key) => {
    Object.keys(res[key].results[0]).forEach((metric) => {
      if (["period_ending", "fiscal_period", "fiscal_year"].includes(metric))
        return;

      const metricData = res[key].results.reduce((acc: any, item: any) => {
        acc[item.fiscal_year.slice(0, 4)] = item[metric];
        return acc;
      }, {});

      data[key as keyof typeof data].push(metricData);
    });
  });

  return data;
};

export async function POST(req: NextRequest) {
  const config = await req.json();

  try {
    const response = await fetch(`${API_BASE_URL}/financials`, {
      method: "POST",
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(cleanRes(data));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch financial data" },
      { status: 500 }
    );
  }
}
