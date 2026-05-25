import * as React from 'react';
import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <Sidebar />
      
      {/* 
        Main content wrapper: 
        - mobile: pb-16 to account for BottomNav, no left margin 
        - md: ml-64 to account for Sidebar, no bottom padding needed for nav
      */}
      <main className="flex flex-col min-h-screen pb-16 md:pb-0 md:ml-64">
        <div className="flex-1 w-full max-w-2xl mx-auto pt-4 md:pt-8 md:px-6 lg:px-8">
          <React.Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground animate-pulse">Loading feed...</div>}>
            <Outlet />
          </React.Suspense>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
