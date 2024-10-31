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
    if (!res[key] || !res[key].results) return;

    Object.keys(res[key].results[0]).forEach((metric) => {
      if (["period_ending", "fiscal_period", "fiscal_year"].includes(metric))
        return;

      const metricData = res[key].results.reduce((acc: any, item: any) => {
        acc[item.period_ending.slice(0, 4)] = item[metric];
        return acc;
      }, {});

      data[key as keyof typeof data].push(
        Object.assign(metricData, { metric })
      );
    });
  });

  return data;
};

export async function POST(req: NextRequest) {
  const config = await req.json();
  console.log(config);

  try {
    const response = await fetch(`${API_BASE_URL}/financials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return NextResponse.json(cleanRes(data));
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch financial data" },
      { status: 500 }
    );
  }
}
