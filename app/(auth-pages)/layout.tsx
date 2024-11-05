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
      <Head>
        <title>Finpanel Login</title>
        <meta name="description" content="Login to Finpanel" />
      </Head>

      <div
        className={cn(
          "bg-slate-100 h-screen w-screen flex justify-center items-center"
          // font.className
        )}
      >
        <div className="bg-background shadow-md w-[330px] h-fit rounded-sm overflow-hidden flex flex-col justify-center items-center py-5 gap-2 px-6">
          <Image
            src="/finpanel_logomark.png"
            alt="Finpanel logo"
            width={40}
            height={40}
          />
          <h1 className="text-lg font-semibold mt-2 mb-4">
            Welcome to Finpanel
          </h1>
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </>
  );
}
