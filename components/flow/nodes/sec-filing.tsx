import Image from "next/image";
import type { Node, NodeProps } from "@xyflow/react";
import {
  Handle,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { StockPicker } from "@/components/widgets/utils/stock-picker";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  NodeTabs,
  NodeTabsContent,
  NodeTabsList,
  NodeTabsTrigger,
} from "@/components/ui/node-tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NodeHeader } from "./utils/header";
import React from "react";
import { Menu } from "./utils/menu";
import { NodeInput, NodeOutput } from "@/types/node";
import { useDebouncedCallback } from "use-debounce";
import { Outputs } from "./utils/outputs";
import { NodeWrapper } from "./utils/node-wrapper";
import { res } from "./temp/sec";
import { createClient } from "@/lib/supabase/client";
import { fetchStockById } from "@/lib/queries";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

type NodeSectionDetail = {
  name: string;
  description: string;
  details: string | null;
};

type NodeSection = {
  name: string;
  subSections: NodeSectionDetail[];
};

type FilingType = {
  type: string;
  description: string;
  sections: NodeSection[];
};

const filingTypes: FilingType[] = [
  {
    type: "10-K",
    description: "Annual Report",
    sections: [
      {
        name: "Part I",
        subSections: [
          {
            name: "Item 1",
            description: "Business",
            details:
              "Description of the company's operations, products, subsidiaries, and markets.",
          },
          {
            name: "Item 1A",
            description: "Risk Factors",
            details:
              "Detailed information on significant risks faced by the company.",
          },
          {
            name: "Item 1B",
            description: "Unresolved Staff Comments",
            details:
              "Discussion of unresolved SEC staff comments on prior reports.",
          },
          {
            name: "Item 2",
            description: "Properties",
            details:
              "Information about significant physical properties like plants or mines.",
          },
          {
            name: "Item 3",
            description: "Legal Proceedings",
            details: "Overview of significant ongoing legal cases.",
          },
          {
            name: "Item 4",
            description: "[Reserved]",
            details: null,
          },
        ],
      },
      {
        name: "Part II",
        subSections: [
          {
            name: "Item 5",
            description:
              "Market for Registrant's Common Equity, Related Stockholder Matters, and Issuer Purchases of Equity Securities",
            details:
              "Information on stock market activity, shareholders, dividends, and stock repurchases.",
          },
          {
            name: "Item 6",
            description: "Selected Financial Data",
            details: "Five-year financial summary.",
          },
          {
            name: "Item 7",
            description: "Management's Discussion and Analysis (MD&A)",
            details:
              "Management's view on financial performance and future trends.",
          },
          {
            name: "Item 7A",
            description:
              "Quantitative and Qualitative Disclosures about Market Risk",
            details:
              "Analysis of risks like interest rates, currency exchange, and equity prices.",
          },
          {
            name: "Item 8",
            description: "Financial Statements and Supplementary Data",
            details: "Audited financial statements and accompanying notes.",
          },
          {
            name: "Item 9",
            description:
              "Changes in and Disagreements with Accountants on Accounting and Financial Disclosure",
            details: "Discussion of any disagreements with auditors.",
          },
          {
            name: "Item 9A",
            description: "Controls and Procedures",
            details: "Overview of internal controls and procedures.",
          },
          {
            name: "Item 9B",
            description: "Other Information",
            details: null,
          },
        ],
      },
      {
        name: "Part III",
        subSections: [
          {
            name: "Item 10",
            description:
              "Directors, Executive Officers, and Corporate Governance",
            details: "Information about directors, officers, and governance.",
          },
          {
            name: "Item 11",
            description: "Executive Compensation",
            details: "Details of executive compensation policies and figures.",
          },
          {
            name: "Item 12",
            description:
              "Security Ownership of Certain Beneficial Owners and Management",
            details: "Ownership details and equity plans.",
          },
          {
            name: "Item 13",
            description:
              "Certain Relationships and Related Transactions, and Director Independence",
            details:
              "Information on related party transactions and director independence.",
          },
          {
            name: "Item 14",
            description: "Principal Accountant Fees and Services",
            details: "Fees paid to accounting firms.",
          },
        ],
      },
      {
        name: "Part IV",
        subSections: [
          {
            name: "Item 15",
            description: "Exhibits and Financial Statement Schedules",
            details:
              "Listing of exhibits and schedules included in the report.",
          },
        ],
      },
    ],
  },
  {
    type: "10-Q",
    description: "Quarterly Report",
    sections: [
      {
        name: "Part I — Financial Information",
        subSections: [
          {
            name: "Item 1",
            description: "Financial Statements",
            details:
              "Includes the registrant's unaudited financial statements for the quarter, such as balance sheets, income statements, cash flow statements, and accompanying notes to the financial statements.",
          },
          {
            name: "Item 2",
            description:
              "Management's Discussion and Analysis of Financial Condition and Results of Operations (MD&A)",
            details:
              "Discusses financial results, trends, and significant events affecting operations during the quarter.",
          },
          {
            name: "Item 3",
            description:
              "Quantitative and Qualitative Disclosures About Market Risk",
            details:
              "Details the registrant's exposure to risks such as interest rate, foreign currency exchange, commodity prices, and equity prices.",
          },
          {
            name: "Item 4",
            description: "Controls and Procedures",
            details:
              "Provides information about the effectiveness of disclosure controls and internal controls over financial reporting.",
          },
        ],
      },
      {
        name: "Part II — Other Information",
        subSections: [
          {
            name: "Item 1",
            description: "Legal Proceedings",
            details:
              "Describes significant legal actions or updates to previously disclosed legal matters.",
          },
          {
            name: "Item 1A",
            description: "Risk Factors",
            details:
              "Reports any material changes to risk factors previously disclosed in the registrant's most recent Form 10-K.",
          },
          {
            name: "Item 2",
            description:
              "Unregistered Sales of Equity Securities and Use of Proceeds",
            details:
              "Information about unregistered sales of securities and repurchases of equity securities during the quarter.",
          },
          {
            name: "Item 3",
            description: "Defaults Upon Senior Securities",
            details:
              "Reports material defaults or arrearages on debt or preferred equity securities.",
          },
          {
            name: "Item 4",
            description: "Mine Safety Disclosures",
            details:
              "If applicable, discloses mine safety information as required by the Dodd-Frank Act.",
          },
          {
            name: "Item 5",
            description: "Other Information",
            details:
              "Reports material events or information not disclosed elsewhere in the 10-Q.",
          },
          {
            name: "Item 6",
            description: "Exhibits",
            details:
              "Lists exhibits filed with the form, such as contracts, agreements, or certifications.",
          },
        ],
      },
    ],
  },
  {
    type: "8-K",
    description: "Current Report",
    sections: [
      {
        name: "Section 1 - Registrant's Business and Operations",
        subSections: [
          {
            name: "Item 1.01",
            description: "Entry into a Material Definitive Agreement",
            details: "",
          },
          {
            name: "Item 1.02",
            description: "Termination of a Material Definitive Agreement",
            details: "",
          },
          {
            name: "Item 1.03",
            description: "Bankruptcy or Receivership",
            details: "",
          },
          {
            name: "Item 1.04",
            description:
              "Mine Safety - Reporting of Shutdowns and Patterns of Violations",
            details: "",
          },
          {
            name: "Item 1.05",
            description: "Material Cybersecurity Incidents",
            details: "",
          },
        ],
      },
      {
        name: "Section 2 - Financial Information",
        subSections: [
          {
            name: "Item 2.01",
            description: "Completion of Acquisition or Disposition of Assets",
            details: "",
          },
          {
            name: "Item 2.02",
            description: "Results of Operations and Financial Condition",
            details: "",
          },
          {
            name: "Item 2.03",
            description:
              "Creation of a Direct Financial Obligation or an Obligation under an Off-Balance Sheet Arrangement",
            details: "",
          },
          {
            name: "Item 2.04",
            description:
              "Triggering Events That Accelerate or Increase a Direct Financial Obligation or Obligation under an Off-Balance Sheet Arrangement",
            details: "",
          },
          {
            name: "Item 2.05",
            description: "Costs Associated with Exit or Disposal Activities",
            details: "",
          },
          {
            name: "Item 2.06",
            description: "Material Impairments",
            details: "",
          },
        ],
      },
      {
        name: "Section 3 - Securities and Trading Markets",
        subSections: [
          {
            name: "Item 3.01",
            description:
              "Notice of Delisting or Failure to Satisfy a Continued Listing Rule or Standard; Transfer of Listing",
            details: "",
          },
          {
            name: "Item 3.02",
            description: "Unregistered Sales of Equity Securities",
            details: "",
          },
          {
            name: "Item 3.03",
            description: "Material Modification to Rights of Security Holders",
            details: "",
          },
        ],
      },
      {
        name: "Section 4 - Matters Related to Accountants and Financial Statements",
        subSections: [
          {
            name: "Item 4.01",
            description: "Changes in Registrant's Certifying Accountant",
            details: "",
          },
          {
            name: "Item 4.02",
            description:
              "Non-Reliance on Previously Issued Financial Statements or a Related Audit Report or Completed Interim Review",
            details: "",
          },
        ],
      },
      {
        name: "Section 5 - Corporate Governance and Management",
        subSections: [
          {
            name: "Item 5.01",
            description: "Changes in Control of Registrant",
            details: "",
          },
          {
            name: "Item 5.02",
            description:
              "Departure of Directors or Certain Officers; Election of Directors; Appointment of Certain Officers; Compensatory Arrangements of Certain Officers",
            details: "",
          },
        ],
      },
      {
        name: "Section 6 - Asset-Backed Securities",
        subSections: [
          {
            name: "Item 6.01",
            description: "ABS Informational and Computational Material",
            details: "",
          },
          {
            name: "Item 6.02",
            description: "Change of Servicer or Trustee",
            details: "",
          },
          {
            name: "Item 6.03",
            description:
              "Change in Credit Enhancement or Other External Support",
            details: "",
          },
          {
            name: "Item 6.04",
            description: "Failure to Make a Required Distribution",
            details: "",
          },
          {
            name: "Item 6.05",
            description: "Securities Act Updating Disclosure",
            details: "",
          },
        ],
      },
      {
        name: "Section 7 - Regulation FD",
        subSections: [
          {
            name: "Item 7.01",
            description: "Regulation FD Disclosure",
            details: "",
          },
        ],
      },
      {
        name: "Section 8 - Other Events",
        subSections: [
          {
            name: "Item 8.01",
            description: "Other Events",
            details: "",
          },
        ],
      },
      {
        name: "Section 9 - Financial Statements and Exhibits",
        subSections: [
          {
            name: "Item 9.01",
            description: "Financial Statements and Exhibits",
            details: "",
          },
        ],
      },
    ],
  },
  {
    type: "DEF 14A",
    description: "Proxy Statement",
    sections: [
      {
        name: "General Information",
        subSections: [],
      },
      {
        name: "Proposals",
        subSections: [],
      },
      {
        name: "Corporate Governance",
        subSections: [],
      },
      {
        name: "Share Ownership",
        subSections: [],
      },
      {
        name: "Auditor Information",
        subSections: [],
      },
      {
        name: "Other Disclosures",
        subSections: [],
      },
      {
        name: "Voting Instructions",
        subSections: [],
      },
      {
        name: "Exhibits",
        subSections: [],
      },
    ],
  },
];

const inputs: NodeInput[] = [
  { label: "ticker", acceptedFormat: "Text", acceptedTypes: ["TXT"] },
];

type Params = {
  ticker: string;
  filingType: string;
  sections: string[];
};

const defaultParams: Params = {
  ticker: "AAPL",
  filingType: "10-K",
  sections:
    filingTypes
      .find((f) => f.type === "10-K")
      ?.sections.flatMap((s) => s.subSections.map((ss) => ss.name)) || [],
};

const outputs: NodeOutput[] = [
  { label: "filing", dataType: "JSON" },
  { label: "filing", dataType: "XML" },
  { label: "tables", dataType: "CSV" },
  { label: "tables", dataType: "XLSX" },
];

const runFn = async (params: Record<string, any>) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return {
    inputData: params.ticker,
    params: params,
    outputData: res,
  };
};

export type SecFilingNodeData = {
  label: string;
  params: Params;
  inputs: NodeInput[];
  outputs: NodeOutput[];
  runFn: (params: Record<string, any>) => Promise<Record<string, any>>;
};

export const defaultData: SecFilingNodeData = {
  label: "SEC Filing Parser",
  params: defaultParams,
  inputs,
  outputs: [{ label: "filing", dataType: "JSON" }],
  runFn,
};

export type SecFilingNodeType = Node<SecFilingNodeData>;

function SecFilingNodeComponent({ id, data }: NodeProps<SecFilingNodeType>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const [params, setParams] = useState<Record<string, any>>(data.params);
  const [stockId, setStockId] = useState<string | null>(null);
  const setParamsDebounced = useDebouncedCallback(
    (params: Record<string, any>) => {
      setParams(params);
    },
    1000
  );
  const { updateNodeData } = useReactFlow();

  const [selectedOutputs, setSelectedOutputs] = useState<NodeOutput[]>(
    data.outputs
  );

  const supabase = createClient();
  const { data: stock } = useQuery(fetchStockById(supabase, stockId ?? ""), {
    enabled: !!stockId,
  });

  useEffect(() => {
    if (stock) {
      setParams({ ...params, ticker: stock.symbol });
    }
  }, [stock]);

  useEffect(() => {
    updateNodeData(id, { params });
    console.log("params", params);
  }, [params]);

  useEffect(() => {
    updateNodeInternals(id);
    updateNodeData(id, { outputs: selectedOutputs });
  }, [selectedOutputs]);

  const sections = useMemo(() => {
    return (
      filingTypes.find((filingType) => filingType.type === params.filingType)
        ?.sections ?? []
    );
  }, [params.filingType]);

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <NodeWrapper
      nodeId={id}
      width="w-[370px]"
      inputs={inputs}
      outputs={selectedOutputs}
    >
      <NodeHeader
        title="SEC Filing Parser"
        bgColor="bg-steel-blue-200"
        textColor="text-steel-blue-900"
        image="/nodes/sec-filing.png"
      />

      <div className="space-y-2 px-2">
        <p className="text-sm font-semibold">Company</p>
        <StockPicker
          currentStockTicker={params.ticker}
          onStockClick={(stockId) => {
            setStockId(stockId);
          }}
        />
        <Separator orientation="horizontal" />
        <p className="text-sm font-semibold">Filing Type</p>
        <div className="flex gap-2">
          {filingTypes.map((filingType) => (
            <div
              key={filingType.type}
              className={cn(
                "rounded-md p-1 space-y-1 border-2 cursor-pointer",
                params.filingType === filingType.type
                  ? "bg-steel-blue-200 border-steel-blue-500"
                  : "bg-muted border-transparent"
              )}
              onClick={() => {
                setParamsDebounced({ ...params, filingType: filingType.type });
              }}
            >
              <div className="flex items-center justify-center bg-background rounded-md p-1">
                <p>{filingType.type}</p>
              </div>
              <p className="text-xs px-1">{filingType.description}</p>
            </div>
          ))}
        </div>
        <Separator orientation="horizontal" />
        <div className="space-y-2">
          <p className="text-sm font-semibold">Sections</p>
          <NodeTabs defaultValue={sections[0]?.name}>
            <NodeTabsList>
              {sections.map((section) => (
                <NodeTabsTrigger key={section.name} value={section.name}>
                  {section.name}
                </NodeTabsTrigger>
              ))}
            </NodeTabsList>
            {sections.map((section) => (
              <NodeTabsContent
                key={section.name}
                value={section.name}
                className="flex flex-wrap gap-2"
              >
                {section.subSections.map((subSection) => (
                  <Badge
                    key={subSection.name}
                    className={cn(
                      "cursor-pointer",
                      params.sections.includes(subSection.name)
                        ? "bg-steel-blue-200 hover:bg-steel-blue-200"
                        : "hover:bg-muted"
                    )}
                    variant="secondary"
                    onClick={() => {
                      if (params.sections.includes(subSection.name)) {
                        setParamsDebounced({
                          ...params,
                          sections: params.sections.filter(
                            (s: string) => s !== subSection.name
                          ),
                        });
                      } else {
                        setParamsDebounced({
                          ...params,
                          sections: [...params.sections, subSection.name],
                        });
                      }
                    }}
                  >
                    {subSection.name}
                  </Badge>
                ))}
              </NodeTabsContent>
            ))}
          </NodeTabs>
        </div>
        <Separator orientation="horizontal" />
        <Outputs
          nodeId={id}
          outputs={outputs}
          selectedOutputs={selectedOutputs}
          setSelectedOutputs={setSelectedOutputs}
        />
        <Separator orientation="horizontal" />
        <div className="flex justify-between">
          <p className="text-xs">Cache output</p>
          <div className="flex items-center space-x-2">
            <Switch defaultChecked={false} id="cache-output" className="" />
            <Label htmlFor="cache-output" className="text-xs">
              Yes
            </Label>
          </div>
        </div>
      </div>
    </NodeWrapper>
  );
}

export const SecFilingNode = React.memo(SecFilingNodeComponent);
