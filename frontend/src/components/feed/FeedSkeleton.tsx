import * as React from 'react';

export function FeedSkeleton() {
  return (
    <div className="space-y-2 md:space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card p-4 md:rounded-2xl border-y md:border border-border animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-3 bg-muted rounded w-16" />
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-4/6" />
          </div>

          <div className="flex gap-4 border-t border-border/50 pt-2">
            <div className="h-10 bg-muted rounded w-20" />
            <div className="h-10 bg-muted rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
