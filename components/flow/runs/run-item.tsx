import { RunLogs } from "./run-logs";
import { RunHeader } from "./run-header";

export const RunItem = () => {
  return (
    <div className="">
      <RunHeader />
      <RunLogs />
    </div>
  );
};
