import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NodeRunResult } from "@/types/node";
import Markdown from "react-markdown";

import remarkGfm from "remark-gfm";

export const ResultContent = ({ result }: { result: NodeRunResult }) => {
  return (
    <ScrollArea className="h-[calc(100vh-3rem)]">
      <Accordion type="single">
        <AccordionItem value="input">
          <AccordionTrigger className="bg-background px-4 font-semibold">
            Input
          </AccordionTrigger>
          <AccordionContent className="bg-background px-4">
            <pre>{JSON.stringify(result.inputData, null, 2)}</pre>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="params">
          <AccordionTrigger className="bg-background px-4 font-semibold">
            Params
          </AccordionTrigger>
          <AccordionContent className="bg-background px-4">
            <pre>{JSON.stringify(result.params, null, 2)}</pre>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="output">
          <AccordionTrigger className="bg-background px-4 font-semibold">
            Output
          </AccordionTrigger>
          <AccordionContent className="bg-background px-4">
            {typeof result.outputData === "object" ? (
              <pre>{JSON.stringify(result.outputData, null, 2)}</pre>
            ) : (
              <Markdown remarkPlugins={[remarkGfm]}>
                {result.outputData}
              </Markdown>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ScrollArea>
  );
};
