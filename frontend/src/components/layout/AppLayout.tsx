import * as React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { CreatePostSheet } from '@/components/create/CreatePostSheet';

export function AppLayout({ children }: { children?: React.ReactNode }) {
  const [createOpen, setCreateOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <Sidebar onCreatePost={() => setCreateOpen(true)} />
      
      {/* 
        Main content wrapper: 
        - mobile: pb-16 to account for BottomNav, no left margin 
        - md: ml-64 to account for Sidebar, no bottom padding needed for nav
      */}
      <main className="flex flex-col min-h-screen pb-16 md:pb-0 md:ml-64">
        <div className="flex-1 w-full max-w-2xl mx-auto pt-4 md:pt-8 md:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <BottomNav onCreate={() => setCreateOpen(true)} />
      <CreatePostSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
