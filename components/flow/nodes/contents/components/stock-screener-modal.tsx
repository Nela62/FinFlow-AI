import { useCallback, useState } from "react";
import Select from "react-tailwindcss-select";
import {
  Option,
  GroupOption,
} from "react-tailwindcss-select/dist/components/type";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Rule = {
  field: string;
  operator: string;
  value: string | number | null;
};

type Group = {
  logic: "AND" | "OR";
  rules: (Rule | Group)[];
};

const initialConfig: Group = {
  logic: "AND",
  rules: [
    { field: "Price", operator: "less", value: 10.25 },
    {
      logic: "OR",
      rules: [
        { field: "Category", operator: "equal", value: "Movies" },
        { field: "Name", operator: "contains", value: "bilbo" },
      ],
    },
  ],
};

const options: GroupOption[] = [
  { label: "Valuation Metrics", options: [{ label: "P/E", value: "P/E" }] },
];

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
    <Card className="p-4">
      <div className="flex items-center">
        <select
          value={group.logic}
          onChange={(e) => {
            const newConfig = { ...config };
            (newConfig.rules[groupIndex] as Group).logic = e.target.value as
              | "AND"
              | "OR";
            setConfig(newConfig);
          }}
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        <Button onClick={() => addRule(groupIndex)}>+ Add Rule</Button>
        <Button onClick={() => addGroup(groupIndex)}>+ Add Group</Button>
      </div>

      {group.rules.map((rule, ruleIndex) =>
        "logic" in rule ? (
          renderRules(rule as Group, ruleIndex)
        ) : (
          <Card className="p-2 mt-2" key={ruleIndex}>
            <input
              type="text"
              placeholder="Field"
              value={rule.field}
              onChange={(e) => {
                const newConfig = { ...config };
                (newConfig.rules[groupIndex] as Group).rules[ruleIndex] = {
                  ...rule,
                  field: e.target.value,
                };
                setConfig(newConfig);
              }}
            />
            <select
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
            </select>
            <input
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
            />
          </Card>
        )
      )}
    </Card>
  );

  const [value, setValue] = useState<Option[]>([]);

  const filterOptions = useCallback((data: Option[]) => {
    return data.filter((item) => !("options" in item));
  }, []);

  return (
    <DialogContent className="max-w-5xl min-w-lg w-[50vw]">
      <DialogHeader>
        <DialogTitle>Edit Stock Filters</DialogTitle>
      </DialogHeader>
      {renderRules(config, 0)}
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
    </DialogContent>
  );
};
