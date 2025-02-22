import Image from "next/image";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import Head from "next/head";

// const font = Montserrat({ subsets: ["latin"] });

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div
        className={cn(
          "bg-slate-100 h-screen w-screen flex justify-center items-center"
          // font.className
        )}
      >
        <div className="bg-background shadow-md w-[330px] h-fit rounded-sm overflow-hidden flex flex-col justify-center items-center py-5 gap-2 px-6">
          <Image src="/logomark.png" alt="Logo" width={40} height={40} />
          <h1 className="text-lg font-semibold mt-2 mb-4">
            Welcome to {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </>
  );
}
