import { RunLogs } from "./run-logs";
import { RunHeader } from "./run-header";

export const RunItem = () => {
  return (
    <div className="space-y-3 p-4">
      <RunHeader />
      <RunLogs />
    </div>
  );
};
