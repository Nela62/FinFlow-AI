import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const metricOptions = [
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

const filterOptions = [
  { label: "Greater Than", value: "Greater Than" },
  { label: "Equal To", value: "Equal To" },
  { label: "Less Than", value: "Less Than" },
];

export const ByMetricSelector = () => {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-semibold">By Metric</Label>
      <div className="flex gap-2">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a metric" />
          </SelectTrigger>
          <SelectContent>
            {metricOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a filter" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="number" />
      </div>
    </div>
  );
};
