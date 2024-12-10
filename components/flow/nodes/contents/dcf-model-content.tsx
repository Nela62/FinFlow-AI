import React, { memo } from "react";
import { useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodeInput, NodeOutput, NodeType } from "@/types/node";
import { DataCategory, FileFormat } from "@/types/dataFormat";
import { NodeData } from "@/types/react-flow";
import { createUpdateConfigValue } from "@/lib/update-config-value";
import { useInputValue } from "@/hooks/use-input-value";

// TODO: Improve this - json or tabular or both?
const inputs: NodeInput[] = [
  {
    label: "financial_data",
    handle: {
      hasHandle: "true",
      dataCategory: DataCategory.Json,
      fileFormats: [FileFormat.JSON],
      isList: false,
      dynamic: true,
    },
    value: {},
  },
  { label: "discount_rate", handle: { hasHandle: "false" }, value: 0 },
  { label: "time_horizon", handle: { hasHandle: "false" }, value: 0 },
  {
    label: "terminal_value",
    handle: { hasHandle: "false" },
    value: "exit-multiple",
  },
  { label: "growth_rate", handle: { hasHandle: "false" }, value: 0 },
  { label: "intrinsic_value", handle: { hasHandle: "false" }, value: 0 },
];

const outputs: NodeOutput[] = [
  {
    label: "dcf-model",
    allowMultiple: false,
    supportedFileFormats: [
      { fileFormat: FileFormat.CSV, value: { selected: true } },
    ],
    isList: false,
  },
];
// terminalValue: "exit-multiple" | "gordon-growth-model";

export const DCF_MODEL_NODE_DEFAULT_DATA: NodeData = {
  title: "DCF Model",
  type: NodeType.DCF_MODEL,
  inputs,
  outputs,
};

export const DcfModelContent = memo(
  ({ id, data }: { id: string; data: NodeData }) => {
    const [config, setConfig] = useState<NodeInput[]>(data.inputs);

    const updateConfigValue = createUpdateConfigValue(setConfig);

    const discountRate = useInputValue(config, "discount_rate");
    const timeHorizon = useInputValue(config, "time_horizon");
    const terminalValue = useInputValue(config, "terminal_value");
    const growthRate = useInputValue(config, "growth_rate");
    const intrinsicValue = useInputValue(config, "intrinsic_value");

    const { updateNodeData } = useReactFlow();

    useEffect(() => {
      updateNodeData(id, { inputs: config });
    }, [config]);

    return (
      <div className="space-y-4 px-2 py-1">
        <div className="space-y-4 nodrag">
          <p className="text-sm font-semibold">Parameters & Assumptions</p>
          <div className="flex gap-4">
            <div className="space-y-1">
              <p className="text-xs">Discount Rate (%)</p>
              <Input
                type="number"
                value={discountRate}
                onChange={(e) =>
                  updateConfigValue("discount_rate", e.target.value)
                }
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs">Time Horizon (Years)</p>
              <Input
                type="number"
                value={timeHorizon}
                onChange={(e) =>
                  updateConfigValue("time_horizon", e.target.value)
                }
              />
            </div>
          </div>
          <p className="text-sm font-semibold">Terminal Value</p>
          <Tabs
            className="w-full"
            value={terminalValue}
            onValueChange={(value) =>
              updateConfigValue("terminal_value", value)
            }
          >
            <TabsList className="w-full">
              <TabsTrigger value="exit-multiple" className="w-1/2 text-xs">
                Exit Multiple
              </TabsTrigger>
              <TabsTrigger
                value="gordon-growth-model"
                className="w-1/2 text-xs"
              >
                Gordon Growth Model
              </TabsTrigger>
            </TabsList>
            <TabsContent value="exit-multiple">
              <div className="flex gap-4">
                <div className="space-y-1">
                  <p className="text-xs">Growth Rate (%)</p>
                  <Input
                    type="number"
                    value={growthRate}
                    onChange={(e) =>
                      updateConfigValue("growth_rate", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs">Exit Multiple</p>
                  <Input
                    type="number"
                    value={intrinsicValue}
                    onChange={(e) =>
                      updateConfigValue("intrinsic_value", e.target.value)
                    }
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="gordon-growth-model">
              <div className="flex gap-4">
                <div className="space-y-1">
                  <p className="text-xs">Growth Rate (%)</p>
                  <Input
                    type="number"
                    value={growthRate}
                    onChange={(e) =>
                      updateConfigValue("growth_rate", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs">Average FCF ($)</p>
                  <Input
                    type="number"
                    value={intrinsicValue}
                    onChange={(e) =>
                      updateConfigValue("intrinsic_value", e.target.value)
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }
);
