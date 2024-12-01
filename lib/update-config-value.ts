import { NodeInput } from "@/types/node";

// export const updateConfigValue = (
//   config: NodeInput[],
//   label: string,
//   newValue: any
// ) => {
//   const updatedValue = config.find((input: NodeInput) => input.label === label);
//   if (updatedValue) {
//     updatedValue.value = newValue;
//   }
// };

export function createUpdateConfigValue(setConfig: any) {
  return function (targetLabel: string, newValue: any) {
    setConfig((prevConfig: NodeInput[]) =>
      prevConfig.map((item) =>
        item.label === targetLabel ? { ...item, value: newValue } : item
      )
    );
  };
}
