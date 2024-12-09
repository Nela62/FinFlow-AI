import { useCallback, useState } from "react";
import Select from "react-tailwindcss-select";
import {
  Option,
  GroupOption,
} from "react-tailwindcss-select/dist/components/type";

import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2Icon } from "lucide-react";
import { STOCK_FILTERS, stockFiltersMap } from "@/lib/stock-filters";
import { ScrollArea } from "@/components/ui/scroll-area";

type Rule = {
  field: string;
  operator: string;
  value: string | number | null;
};

type Group = {
  logic: "AND" | "OR";
  rules: (Rule | Group)[];
};

const numberOperators: Option[] = [
  { label: "<=", value: "less_equal" },
  { label: "<", value: "less" },
  { label: "==", value: "equal" },
  { label: ">", value: "greater" },
  { label: ">=", value: "greater_equal" },
];

const stringOperators: Option[] = [
  { label: "contains", value: "contains" },
  { label: "does not contain", value: "does_not_contain" },
  { label: "is", value: "is" },
  { label: "is not", value: "is_not" },
  { label: "in", value: "in" },
  { label: "not in", value: "not_in" },
];

const stringMetrics = ["industry", "sector", "exchange"];

const initialConfig: Group = {
  logic: "AND",
  rules: [
    { field: "industry", operator: "is", value: "Oil & Gas" },
    {
      logic: "AND",
      rules: [
        { field: "pe_ratio", operator: "less", value: 15 },
        {
          logic: "OR",
          rules: [
            { field: "dividend_yield", operator: "greater", value: 4 },
            { field: "revenue_growth_yoy", operator: "greater", value: 10 },
          ],
        },
        {
          logic: "OR",
          rules: [
            { field: "debt_to_equity", operator: "less", value: 0.5 },
            { field: "current_ratio", operator: "greater", value: 1.5 },
          ],
        },
      ],
    },
  ],
};

export const StockScreenerModal = () => {
  const [config, setConfig] = useState<Group>(initialConfig);

  const addRule = (groupIndex: number) => {
    const newConfig = { ...config };
    (newConfig.rules[groupIndex] as Group).rules.push({
      field: "",
      operator: "",
      value: null,
    });
    setConfig(newConfig);
  };

  const addGroup = (groupIndex: number) => {
    const newConfig = { ...config };
    (newConfig.rules[groupIndex] as Group).rules.push({
      logic: "AND",
      rules: [],
    });
    setConfig(newConfig);
  };

  const renderRules = (group: Group, groupIndex: number) => (
    <Card className="p-4" key={groupIndex}>
      <div className="flex items-center justify-between">
        <div className="flex">
          <Button
            variant={group.logic === "AND" ? "secondary" : "outline"}
            size="sm"
            className="rounded-r-none"
            onClick={() => {
              const newConfig = { ...config };
              (newConfig.rules[groupIndex] as Group).logic = "AND";
              setConfig(newConfig);
            }}
          >
            AND
          </Button>
          <Button
            className="rounded-l-none"
            variant={group.logic === "OR" ? "secondary" : "outline"}
            size="sm"
            onClick={() => {
              const newConfig = { ...config };
              (newConfig.rules[groupIndex] as Group).logic = "OR";
              setConfig(newConfig);
            }}
          >
            OR
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => addRule(groupIndex)}
          >
            + Add Rule
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => addGroup(groupIndex)}
          >
            + Add Group
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {group.rules.map((rule, ruleIndex) =>
          "logic" in rule ? (
            renderRules(rule as Group, ruleIndex)
          ) : (
            <div
              className="p-2 mt-2 grid grid-cols-[2fr_1fr_1fr_auto] gap-2"
              key={ruleIndex}
            >
              <Select
                options={STOCK_FILTERS.map((group) => ({
                  label: group.label,
                  options: group.options.map((option) => ({
                    label:
                      stockFiltersMap[option as keyof typeof stockFiltersMap],
                    value: option,
                  })),
                }))}
                value={{
                  label:
                    stockFiltersMap[rule.field as keyof typeof stockFiltersMap],
                  value: rule.field,
                }}
                onChange={(value) => {
                  // if (value && Array.isArray(value)) {
                  //   setValue(value);
                  // }
                }}
                primaryColor="sky"
                isClearable
                isSearchable
                formatGroupLabel={(data) => (
                  <div
                    className={`py-2 text-xs flex items-center justify-between`}
                  >
                    <span className="font-bold">{data.label}</span>
                    <span className="bg-gray-200 h-5 p-1.5 flex items-center justify-center rounded-full">
                      {data.options.length}
                    </span>
                  </div>
                )}
              />

              <Select
                options={
                  stringMetrics.includes(rule.field)
                    ? stringOperators
                    : numberOperators
                }
                value={operator}
                primaryColor="sky"
                onChange={(value) => {
                  // const newConfig = { ...config };
                  // (newConfig.rules[groupIndex] as Group).rules[ruleIndex] = {
                  //   ...rule,
                  //   operator: value,
                  // };
                  // setConfig(newConfig);
                }}
              />
              <Input
                type="text"
                placeholder="Field"
                value={rule.value ?? ""}
                onChange={(e) => {
                  const newConfig = { ...config };
                  (newConfig.rules[groupIndex] as Group).rules[ruleIndex] = {
                    ...rule,
                    field: e.target.value,
                  };
                  setConfig(newConfig);
                }}
              />
              <Button variant="secondary" size="icon">
                <Trash2Icon className="w-4 h-4" />
              </Button>
              {/* <select
              value={rule.operator}
              onChange={(e) => {
                const newConfig = { ...config };
                (newConfig.rules[groupIndex] as Group).rules[ruleIndex] = {
                  ...rule,
                  operator: e.target.value,
                };
                setConfig(newConfig);
              }}
            >
              <option value="less">less</option>
              <option value="equal">equal</option>
              <option value="contains">contains</option>
            </select> */}
              {/* <input
              type="text"
              placeholder="Value"
              value={rule.value ?? ""}
              onChange={(e) => {
                const newConfig = { ...config };
                (newConfig.rules[groupIndex] as Group).rules[ruleIndex] = {
                  ...rule,
                  value: e.target.value,
                };
                setConfig(newConfig);
              }}
              /> */}
            </div>
          )
        )}
      </div>
    </Card>
  );

  const [value, setValue] = useState<Option[]>([]);
  const [operator, setOperator] = useState<Option>(numberOperators[0]);

  const filterOptions = useCallback((data: Option[]) => {
    return data.filter((item) => !("options" in item));
  }, []);

  return (
    <DialogContent className="max-w-5xl min-w-lg w-[70vw] h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Edit Stock Filters</DialogTitle>
      </DialogHeader>
      <ScrollArea className="flex-1 h-full">
        {renderRules(config, 0)}
      </ScrollArea>

      {/* <Select
        options={options}
        value={value}
        onChange={(value) => {
          if (value && Array.isArray(value)) {
            setValue(value);
          }
        }}
        primaryColor="sky"
        isClearable
        isSearchable
        isMultiple
        formatGroupLabel={(data) => (
          <div className={`py-2 text-xs flex items-center justify-between`}>
            <span className="font-bold">{data.label}</span>
            <span className="bg-gray-200 h-5 p-1.5 flex items-center justify-center rounded-full">
              {data.options.length}
            </span>
          </div>
        )}
      /> */}
      <DialogFooter>
        <Button>Save</Button>
      </DialogFooter>
    </DialogContent>
  );
};
