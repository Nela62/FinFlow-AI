// {
//     type: "10-K",
//     description: "Annual Report",
//     sections: [
//       {
//         name: "Part I",
//         subSections: [
//           "Item 1. Business",
//           "Item 1A. Risk Factors",
//           "Mine Safety Disclosures",
//           "Unresolved Staff Comments",
//           "Legal Proceedings",
//         ],
//       },
//       {
//         name: "Part II",
//         subSections: [
//           "Item 1. Business",
//           "Item 1A. Risk Factors",
//           "Mine Safety Disclosures",
//           "Unresolved Staff Comments",
//           "Legal Proceedings",
//         ],
//       },
//     ],
//   };

export type NodeSection = {
  name: string;
  subSections: string[];
};
