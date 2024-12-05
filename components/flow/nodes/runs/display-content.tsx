import { AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { AccordionItem } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ReactJson = dynamic(() => import("react-json-view"), {
  ssr: false,
});

const getContent = (content: any) => {
  if (typeof content === "object") {
    return <ReactJson src={content} style={{ width: "480px" }} />;
  }
  console.log("markdown");
  return (
    <Markdown
      components={{
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto w-[480px]">
            <table
              {...props}
              style={{
                width: "100%",
              }}
              className="text-xs whitespace-nowrap"
            />
          </div>
        ),
        p: ({ node, ...props }) => (
          <p className="max-w-[470px] text-wrap text-sm py-1" {...props} />
        ),
        h1: ({ node, ...props }) => (
          <h1 className="text-xl font-semibold py-2" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-lg font-semibold py-2" {...props} />
        ),
      }}
      remarkPlugins={[remarkGfm]}
      className="markdown w-fit"
    >
      {content}
    </Markdown>
  );
};

export const DisplayContent = ({
  name,
  content,
}: {
  name: string;
  content: any;
}) => {
  return (
    <AccordionItem value={name} className="flex flex-col h-full border-none">
      <AccordionTrigger className="bg-background px-2 py-4 font-semibold border-b">
        {name}
      </AccordionTrigger>
      <AccordionContent className="flex flex-col h-full bg-slate-100 p-0">
        <ScrollArea className="flex-1 overflow-y-auto">
          {getContent(content.slice(0, 1000))}
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  );
};
