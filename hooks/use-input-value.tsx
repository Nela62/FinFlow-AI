import { NodeInput } from "@/types/node";

import { useMemo } from "react";

export const useInputValue = (config: NodeInput[], label: string) => {
  const value = useMemo(
    () => config.find((input: NodeInput) => input.label === label)?.value,
    [config, label]
  );
  return value;
};
