import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RunLogs } from "./run-logs";
import { RunOutputs } from "./run-outputs";
import { RunHeader } from "./run-header";

export const RunItem = () => {
  return (
    <div className="space-y-3">
      <RunHeader />
      <Tabs defaultValue="logs">
        <TabsList className="w-full">
          <TabsTrigger value="logs" className="w-1/2">
            Logs
          </TabsTrigger>
          <TabsTrigger value="output" className="w-1/2">
            Outputs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="logs">
          <RunLogs />
        </TabsContent>
        <TabsContent value="output">
          <RunOutputs />
        </TabsContent>
      </Tabs>
    </div>
  );
};
