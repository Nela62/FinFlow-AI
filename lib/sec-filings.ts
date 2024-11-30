export type NodeSectionDetail = {
  name: string;
  description: string;
  details: string | null;
};

export type NodeSection = {
  name: string;
  subSections: NodeSectionDetail[];
};

export type FilingType = {
  type: string;
  description: string;
  sections: NodeSection[];
};

export const SEC_FILING_TYPES: FilingType[] = [
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
