import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Select from "react-tailwindcss-select";
import { Option } from "react-tailwindcss-select/dist/components/type";
import { Label } from "@/components/ui/label";
import { Trigger } from "../toolbar";

const options: Option[] = [
  { label: "10-Q", value: "10-Q" },
  { label: "10-K", value: "10-K" },
  { label: "8-K", value: "8-K" },
];

export const SecFilingTypeSelector = ({
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
      <Label className="text-sm font-semibold">SEC Filing Type</Label>
      <Select
        options={filterOptions(options)}
        value={value}
        onChange={(value) => {
          if (value && Array.isArray(value)) {
            setValue(value);
            setTrigger({
              id: uuidv4(),
              name: "SEC Filing",
              config: { filingTypes: value.map((v) => v.label) },
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
