import { useCallback, useState } from "react";
import Select from "react-tailwindcss-select";
import { Option } from "react-tailwindcss-select/dist/components/type";
import { Label } from "@/components/ui/label";

const options: Option[] = [
  { label: "Quarterly Earnings Calls", value: "Quarterly Earnings Calls" },
  { label: "Annual Earnings Calls", value: "Annual Earnings Calls" },
  { label: "Preliminary Earnings Calls", value: "Preliminary Earnings Calls" },
  { label: "Special Earnings Calls", value: "Special Earnings Calls" },
  {
    label: "Supplemental Earnings Calls",
    value: "Supplemental Earnings Calls",
  },
  {
    label: "Guidance Updates or Pre-Announcements",
    value: "Guidance Updates or Pre-Announcements",
  },
  {
    label: "Crisis or Emergency Earnings Calls",
    value: "Crisis or Emergency Earnings Calls",
  },
];

export const EarningsCallTypeSelector = () => {
  const [value, setValue] = useState<Option[]>([]);

  const filterOptions = useCallback((data: Option[]) => {
    return data.filter((item) => !("options" in item));
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-semibold">Earnings Call Type</Label>
      <Select
        options={filterOptions(options)}
        value={value}
        onChange={(value) => value && Array.isArray(value) && setValue(value)}
        primaryColor="sky"
        isClearable
        isSearchable
        isMultiple
      />
    </div>
  );
};
