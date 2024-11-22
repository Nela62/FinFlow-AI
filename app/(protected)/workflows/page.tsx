"use client";

import { Flow } from "@/components/flow/flow";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkflowPage() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email === "demo-user@fin-flow.ai") {
        router.push("/panels");
      }
    });
  }, []);

  useEffect(() => {
    // Disable page zooming
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.getElementsByTagName("head")[0].appendChild(meta);

    // Cleanup function to remove the meta tag when component unmounts
    return () => {
      document.getElementsByTagName("head")[0].removeChild(meta);
    };
  }, []);

  return (
    // FIXME:
    <div className="h-[calc(100vh-62px)] w-[calc(100vw-70px)]">
      <Flow />
    </div>
  );
}
