import { useCallback, useState } from "react";
import Select from "react-tailwindcss-select";
import { Option } from "react-tailwindcss-select/dist/components/type";
import { Label } from "@/components/ui/label";

const options: Option[] = [
  { label: "10-Q", value: "10-Q" },
  { label: "10-K", value: "10-K" },
  { label: "8-K", value: "8-K" },
];

export const SecFilingTypeSelector = () => {
  const [value, setValue] = useState<Option[]>([]);

  const filterOptions = useCallback((data: Option[]) => {
    return data.filter((item) => !("options" in item));
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-semibold">SEC Filing Type</Label>
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
