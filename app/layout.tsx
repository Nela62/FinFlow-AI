import { Raleway } from "next/font/google";
// import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { AIStoreProvider } from "@/providers/aiStoreProvider";
import { SidebarStoreProvider } from "@/providers/sidebarStoreProvider";
import { ReactQueryClientProvider } from "@/providers/reactQueryClientProvider";
import { NodesStoreProvider } from "@/providers/nodesProvider";

const defaultUrl = "http://localhost:3000";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: "Workflow automation for financial tasks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={raleway.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ReactQueryClientProvider>
          <SidebarStoreProvider>
            <AIStoreProvider>
              <NodesStoreProvider>
                <ThemeProvider
                  attribute="class"
                  // defaultTheme="system"
                  defaultTheme="light"
                  enableSystem
                  disableTransitionOnChange
                >
                  <main className="min-h-screen">{children}</main>
                </ThemeProvider>
              </NodesStoreProvider>
            </AIStoreProvider>
          </SidebarStoreProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
