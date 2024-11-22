import { createClient } from "@/lib/supabase/client";
import {
  useInsertMutation,
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Stock } from "@/types/panel";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useCallback, useState } from "react";
import { TypedSupabaseClient } from "@/types/supabase";
import {
  fetchPanelByUrl,
  fetchStockByTicker,
  fetchWidgetById,
} from "@/lib/queries";
import { usePathname } from "next/navigation";
import { AddWidgetComponent } from "./utils/add-widget";
import { Button } from "../ui/button";

export const TopBarAddWidgets = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  const panelUrl = paths[paths.length - 1];

  const supabase = createClient();

  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const { data: panel } = useQuery(fetchPanelByUrl(supabase, panelUrl));

  const { mutateAsync: addWidget } = useInsertMutation(
    supabase.from("widgets"),
    ["id"],
    "id"
  );

  const panelId = panel?.id;

  if (paths.includes("panels") && !paths.includes("new")) {
    return (
      <Dialog>
        <DialogTrigger className="bg-accent-foreground/10 hover:bg-accent-foreground/20 py-1 px-2 rounded-full ml-2">
          <p className="text-xs text-accent-foreground">+ Add widgets</p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] h-[562px] ">
          <DialogTitle>Select widgets</DialogTitle>
          <AddWidgetComponent
            selectedWidgets={selectedWidgets}
            setSelectedWidgets={setSelectedWidgets}
          />
          <DialogFooter>
            <Button>Add widgets</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
};
