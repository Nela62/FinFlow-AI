import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  useDeleteMutation,
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";
import { fetchAllPanels } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Button } from "./ui/button";

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  const router = useRouter();

  const [edit, setEdit] = useState(false);

  const supabase = createClient();
  const { data: panels } = useQuery(fetchAllPanels(supabase));

  const { mutateAsync: updatePanel } = useUpdateMutation(
    supabase.from("panels"),
    ["id"],
    "id"
  );
  const { mutateAsync: deletePanel } = useDeleteMutation(
    supabase.from("panels"),
    ["id"],
    "id"
  );

  const content = useMemo(() => {
    if (
      (paths.includes("panels") || paths.includes("reports")) &&
      !paths.includes("new")
    ) {
      if (paths.includes("panels")) {
        return panels?.find((panel) => panel.url === paths[paths.length - 1])
          ?.name;
      } else if (paths.includes("reports")) {
        return "Reports";
      }
      return null;
    } else {
      return null;
    }
  }, [panels, paths]);

  const panelId = useMemo(() => {
    if (paths.includes("panels")) {
      return panels?.find((panel) => panel.url === paths[paths.length - 1])?.id;
    }
    return null;
  }, [panels, paths]);

  // FIXME: Default values are not updating
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => ({
      name: content ?? "",
    }),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const panelId = panels?.find(
      (panel) => panel.url === paths[paths.length - 1]
    )?.id;
    if (panelId) {
      updatePanel({ id: panelId, name: values.name });
    }
    setEdit(false);
  }

  return (
    <Breadcrumb className="ml-2">
      <BreadcrumbList>
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;

          return (
            <Fragment key={path}>
              <BreadcrumbItem>
                {isLast ? (
                  content ? (
                    <>
                      <BreadcrumbPage className="capitalize">
                        {edit ? (
                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit(onSubmit)}
                              className="flex gap-2"
                            >
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button type="submit" variant="ghost">
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setEdit(false)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </form>
                          </Form>
                        ) : (
                          content
                        )}
                      </BreadcrumbPage>
                      {!edit && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEdit(true)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (panelId) {
                                deletePanel({ id: panelId });
                                router.push("/panels");
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <BreadcrumbPage className="capitalize">
                      {path.replace(/-/g, " ")}
                    </BreadcrumbPage>
                  )
                ) : (
                  <div className="capitalize">{path.replace(/-/g, " ")}</div>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
