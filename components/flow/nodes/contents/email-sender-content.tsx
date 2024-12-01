import { memo, useCallback, useEffect, useState } from "react";
import { NodeInput, NodeOutput, NodeType } from "@/types/node";
import { Input } from "@/components/ui/input";
import { DataCategory, FileFormat } from "@/types/dataFormat";
import { useReactFlow } from "@xyflow/react";
import { createClient } from "@/lib/supabase/client";
import { fetchSettings } from "@/lib/queries";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { NodeData } from "@/types/react-flow";

// TODO: add template
// TODO: add file attachments
// TODO: add variables (e.g., {{ticker}})

const inputs: NodeInput[] = [
  {
    label: "content",
    handle: {
      hasHandle: "true",
      dataCategory: DataCategory.Text,
      fileFormats: [FileFormat.TXT],
      dynamic: false,
    },
    value: "",
  },
  {
    label: "email_recipient",
    handle: {
      hasHandle: "false",
    },
    value: "",
  },
  {
    label: "subject",
    handle: {
      hasHandle: "false",
    },
    value: "",
  },
];

const outputs: NodeOutput[] = [];

export const EMAIL_SENDER_NODE_DEFAULT_DATA: NodeData = {
  title: "Email Sender",
  type: NodeType.EMAIL_SENDER,
  inputs,
  outputs,
};

export const EmailSenderContent = memo(
  ({ id, data }: { id: string; data: NodeData }) => {
    const [config, setConfig] = useState<Record<string, any>>(data.inputs);

    const supabase = createClient();
    const { data: settings } = useQuery(fetchSettings(supabase));

    const { updateNodeData } = useReactFlow();

    const updateConfigValue = useCallback(
      (key: string, value: any) => {
        setConfig({ ...config, [key]: { ...config[key], value } });
      },
      [config, setConfig]
    );

    useEffect(() => {
      if (settings) {
        updateConfigValue("email_recipient", settings.email);
      }
    }, [settings]);

    useEffect(() => {
      updateNodeData(id, { inputs: config });
    }, [config]);

    return (
      <div className="space-y-2 px-2">
        <div className="space-y-4 nodrag">
          <p className="text-sm font-semibold">Settings</p>
          <div className="space-y-1 w-full">
            <p className="text-xs">Email recipient</p>
            <Input
              className="w-full"
              type="email"
              value={config.email_recipient}
              onChange={(e) =>
                updateConfigValue("email_recipient", e.target.value)
              }
            />
          </div>
          <div className="space-y-1 w-full">
            <p className="text-xs">Subject</p>
            <Input
              className="w-full"
              type="text"
              value={config.subject}
              onChange={(e) => updateConfigValue("subject", e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }
);
