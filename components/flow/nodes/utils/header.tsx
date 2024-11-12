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
        "flex items-center gap-4 rounded-md p-1.5",
        bgColor,
        textColor
      )}
    >
      {image ? (
        <Image
          src="/nodes/sec-filing.png"
          alt="Node Image"
          className="rounded-md"
          width={50}
          height={50}
        />
      ) : (
        iconFn &&
        iconBgColor && (
          <div
            className={cn(
              "rounded-md p-3 w-[50px] h-[50px] shadow-sm",
              iconBgColor
            )}
          >
            {iconFn({ className: "w-full h-full text-white" })}
          </div>
        )
      )}
      <p className="">{title}</p>
    </div>
  );
};
