import { useState, type ReactNode } from "react";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { CreatePostSheet } from "@/components/create/CreatePostSheet";

export function AppShell({ children }: { children: ReactNode }) {
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="mx-auto max-w-2xl px-3 pb-28 pt-3 sm:px-4">
        {children}
      </main>
      <BottomNav onCreate={() => setCreateOpen(true)} />
      <CreatePostSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
