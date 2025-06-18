import { Inter } from "next/font/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./globals.css";
import { TanStackQueryClientProvider } from "@/lib/api/query-client-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ImageViewerModal } from "./components/ImageViewerModal";
import { StartingServerLoader } from "./components/StartingServerLoader";
import LayoutWithHeader from "./components/Header";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: "600",
});

export const metadata = {
  title: "Go Rahee",
  description: "Find your stay",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn(inter.className)}>
          <TanStackQueryClientProvider>
            <LayoutWithHeader>{children}</LayoutWithHeader>
            <ImageViewerModal />
            <Toaster richColors />
            <StartingServerLoader />
            <ReactQueryDevtools initialIsOpen={false} />
          </TanStackQueryClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
