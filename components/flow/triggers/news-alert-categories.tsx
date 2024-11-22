import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Select from "react-tailwindcss-select";
import { Option } from "react-tailwindcss-select/dist/components/type";
import { Label } from "@/components/ui/label";
import { Trigger } from "../toolbar";

const options: Option[] = [
  { label: "Price Change", value: "Price Change" },
  { label: "News Surge", value: "News Surge" },
  { label: "Sentiment Change", value: "Sentiment Change" },
  { label: "Earnings", value: "Earnings" },
  { label: "Bankruptcy Rumors", value: "Bankruptcy Rumors" },
  { label: "Lawsuit", value: "Lawsuit" },
  { label: "Mergers & Acquisitions", value: "Mergers & Acquisitions" },
  { label: "Investor Activity", value: "Investor Activity" },
  { label: "Executive Activity", value: "Executive Activity" },
  { label: "FDA Approval", value: "FDA Approval" },
];

export const NewsAlertCategoriesSelector = ({
  setTrigger,
}: {
  setTrigger: (trigger: Trigger) => void;
}) => {
  const [value, setValue] = useState<Option[]>([]);

  const filterOptions = useCallback((data: Option[]) => {
    return data.filter((item) => !("options" in item));
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-semibold">News Alert Categories</Label>
      <Select
        options={filterOptions(options)}
        value={value}
        onChange={(value) => {
          if (value && Array.isArray(value)) {
            setValue(value);
            setTrigger({
              id: uuidv4(),
              name: "News Alert",
              config: { categories: value.map((v) => v.label) },
            });
          }
        }}
        primaryColor="sky"
        isClearable
        isSearchable
        isMultiple
      />
    </div>
  );
};
