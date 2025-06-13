"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { appState, } from "../data/appState";

export function StartingServerLoader() {
  const isStartingServer = appState((s) => s.isStartingServer);
  const [visible, setVisible] = useState(false);

  // Delay showing the dialog just a bit to avoid flicker for fast responses
  useEffect(() => {
    let timeout;
    if (isStartingServer) {
      timeout = setTimeout(() => setVisible(true), 300); // slight delay
    } else {
      setVisible(false);
    }
    return () => clearTimeout(timeout);
  }, [isStartingServer]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 text-center rounded-2xl p-6 shadow-2xl w-72 border">
        <div className="flex justify-center mb-4">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Waking up the server...</h2>
        <p className="text-sm text-muted-foreground mt-4">
          {`It'll take less than a minute. `}
          <br />
          <strong>Thanks for your patience!</strong>
        </p>
      </div>
    </div>
  );
}
