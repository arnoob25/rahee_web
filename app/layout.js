import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./globals.css";
import { TanStackQueryClientProvider } from "@/lib/api/query-client-provider";

export const metadata = {
  title: "Go Rahee",
  description: "Find your stay",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TanStackQueryClientProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </TanStackQueryClientProvider>
      </body>
    </html>
  );
}
