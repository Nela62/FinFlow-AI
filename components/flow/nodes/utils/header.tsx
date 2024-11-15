import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SVGProps } from "react";

type NodeHeaderProps = {
  title: string;
  bgColor: string;
  iconBgColor?: string;
  textColor: string;
  iconFn?: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
  image?: string;
};

export const NodeHeader = ({
  title,
  bgColor,
  iconBgColor,
  textColor,
  iconFn,
  image,
}: NodeHeaderProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-md p-2 mb-4",
        bgColor,
        textColor
      )}
    >
      {image ? (
        <Image
          src="/nodes/sec-filing.png"
          alt="Node Image"
          className="rounded-md"
          width={60}
          height={60}
        />
      ) : (
        iconFn &&
        iconBgColor && (
          <div
            className={cn(
              "rounded-md p-3 w-[60px] h-[60px] shadow-sm",
              iconBgColor
            )}
          >
            {iconFn({ className: "w-full h-full text-white" })}
          </div>
        )
      )}
      <p className="font-semibold text-lg">{title}</p>
    </div>
  );
};
