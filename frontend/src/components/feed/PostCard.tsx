import * as React from 'react';
import { ArrowBigUp, Flag, MessageSquare, MoreHorizontal } from 'lucide-react';
import type { PostResponse } from '../../api/generated/model';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useUpvotePostsPostIdUpvotePost, getGetPostsPostsGetQueryKey } from '../../api/generated/posts/posts';
import { useQueryClient } from '@tanstack/react-query';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PostCardProps {
  post: PostResponse;
  onFlag?: (id: string) => void;
}

export function PostCard({ post, onFlag }: PostCardProps) {
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric'
  });

  const queryClient = useQueryClient();
  const upvoteMutation = useUpvotePostsPostIdUpvotePost({
    mutation: {
      onMutate: async ({ postId }) => {
        await queryClient.cancelQueries({ queryKey: getGetPostsPostsGetQueryKey() });
        const previousData = queryClient.getQueryData(getGetPostsPostsGetQueryKey());

        queryClient.setQueryData(getGetPostsPostsGetQueryKey(), (old: any) => {
          if (!old?.data?.posts) return old;
          return {
            ...old,
            data: {
              ...old.data,
              posts: old.data.posts.map((p: PostResponse) =>
                p.id === postId ? { ...p, upvote_count: p.upvote_count + 1 } : p
              ),
            },
          };
        });

        return { previousData };
      },
      onError: (err, newTodo, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(getGetPostsPostsGetQueryKey(), context.previousData);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getGetPostsPostsGetQueryKey() });
      },
    }
  });

  return (
    <article className="bg-card text-card-foreground p-4 mb-2 md:mb-4 md:rounded-2xl border-y md:border border-border">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <UserIcon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <div className="font-semibold text-sm">Anonymous</div>
            <div className="text-xs text-muted-foreground">{formattedDate}</div>
          </div>
        </div>
        
        <button className="p-3 -mr-3 -mt-2 text-muted-foreground hover:bg-accent rounded-full transition-colors active:scale-95">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4 text-base whitespace-pre-wrap break-words leading-relaxed px-1">
        {post.content}
      </div>

      <div className="flex items-center justify-between text-muted-foreground border-t border-border/50 pt-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => upvoteMutation.mutate({ postId: post.id })}
            className="flex items-center gap-2 group p-2 rounded-xl hover:bg-primary/10 transition-colors active:scale-95"
            disabled={upvoteMutation.isPending}
          >
            <ArrowBigUp className="w-6 h-6 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">
              {post.upvote_count}
            </span>
          </button>
          
          <button className="flex items-center gap-2 group p-2 rounded-xl hover:bg-blue-500/10 transition-colors active:scale-95">
            <MessageSquare className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
            <span className="text-sm font-medium group-hover:text-blue-500 transition-colors">
              Reply
            </span>
          </button>
        </div>

        <button 
          onClick={() => onFlag?.(post.id)}
          className="p-3 -mr-3 hover:bg-destructive/10 rounded-xl transition-colors group active:scale-95"
        >
          <Flag className="w-5 h-5 group-hover:text-destructive transition-colors" />
        </button>
      </div>
    </article>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
