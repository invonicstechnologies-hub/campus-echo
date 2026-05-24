import { aliasFromSeed } from "./anon";

export type Community = {
  slug: string;
  name: string;
  members: number;
};

export type Post = {
  id: string;
  authorSeed: string;
  community: string;
  title: string;
  body: string;
  ageMinutes: number;
  upvotes: number;
  downvotes: number;
  comments: number;
  reposts: number;
  trending?: boolean;
  tag?: "confession" | "opinion" | "question" | "rant";
};

export type Comment = {
  id: string;
  postId: string;
  parentId?: string;
  authorSeed: string;
  body: string;
  ageMinutes: number;
  upvotes: number;
};

export const communities: Community[] = [
  { slug: "confessions", name: "Confessions", members: 18420 },
  { slug: "dorm-life", name: "Dorm Life", members: 9210 },
  { slug: "academics", name: "Academics", members: 12800 },
  { slug: "relationships", name: "Relationships", members: 15640 },
  { slug: "rants", name: "Rants", members: 7320 },
  { slug: "after-dark", name: "After Dark", members: 5440 },
];

const HOUR = 3600_000;

export const posts: Post[] = [
  {
    id: "p1",
    authorSeed: "seed-aurora-7",
    community: "confessions",
    title: "I've been pretending to understand calc 3 for an entire semester",
    body: "Office hours are tomorrow and I genuinely don't know what a gradient field is. My group thinks I'm carrying them. I'm not. I'm drowning quietly in a really cute notebook.",
    createdAt: Date.now() - 0.4 * HOUR,
    upvotes: 1284, downvotes: 12, comments: 213, reposts: 41,
    trending: true, tag: "confession",
  },
  {
    id: "p2",
    authorSeed: "seed-velvet-2",
    community: "relationships",
    title: "she said 'we should study together' and I think I'm dying",
    body: "Library, 7pm, second floor. I have showered twice. Please advise.",
    createdAt: Date.now() - 1.2 * HOUR,
    upvotes: 892, downvotes: 4, comments: 156, reposts: 23,
    trending: true, tag: "opinion",
  },
  {
    id: "p3",
    authorSeed: "seed-iron-9",
    community: "rants",
    title: "the dining hall calling that 'pad thai' is a federal crime",
    body: "It was beige. All of it. The noodles, the sauce, the protein-shaped substance. Beige.",
    createdAt: Date.now() - 3 * HOUR,
    upvotes: 2104, downvotes: 38, comments: 412, reposts: 188,
    trending: true, tag: "rant",
  },
  {
    id: "p4",
    authorSeed: "seed-neon-3",
    community: "academics",
    title: "anyone else feel like junior year is just a long blink?",
    body: "Started in august. It is somehow november. I have aged four years.",
    createdAt: Date.now() - 5 * HOUR,
    upvotes: 612, downvotes: 6, comments: 89, reposts: 12,
    tag: "question",
  },
  {
    id: "p5",
    authorSeed: "seed-paper-1",
    community: "dorm-life",
    title: "my roommate brought a 7ft cactus into our triple",
    body: "His name is Gregory. He has a tiny hat. I have nowhere to put my desk. I have never been happier.",
    createdAt: Date.now() - 8 * HOUR,
    upvotes: 3402, downvotes: 22, comments: 287, reposts: 240,
    trending: true,
  },
  {
    id: "p6",
    authorSeed: "seed-quiet-4",
    community: "after-dark",
    title: "3am thought: we're all just performing 'fine' to each other",
    body: "Like, everyone on this campus is silently negotiating how much of themselves to show. And we keep choosing less.",
    createdAt: Date.now() - 14 * HOUR,
    upvotes: 1820, downvotes: 18, comments: 304, reposts: 96,
    tag: "opinion",
  },
  {
    id: "p7",
    authorSeed: "seed-honest-5",
    community: "confessions",
    title: "i applied to the same internship as my best friend and didn't tell her",
    body: "She got rejected. I got the offer. We're getting coffee tomorrow. I have until 10am to become a better person.",
    createdAt: Date.now() - 22 * HOUR,
    upvotes: 980, downvotes: 64, comments: 521, reposts: 31,
    tag: "confession",
  },
];

export function postsBy(seed: string): Post[] {
  return posts.filter(p => p.authorSeed === seed);
}

export function getPost(id: string): Post | undefined {
  return posts.find(p => p.id === id);
}

export const comments: Comment[] = [
  { id: "c1", postId: "p1", authorSeed: "seed-tender-3", body: "literally me. I just nod when anyone says 'parameterize'.", createdAt: Date.now() - 0.3 * HOUR, upvotes: 142 },
  { id: "c2", postId: "p1", parentId: "c1", authorSeed: "seed-mirror-8", body: "nod harder. that's the strategy.", createdAt: Date.now() - 0.25 * HOUR, upvotes: 87 },
  { id: "c3", postId: "p1", parentId: "c2", authorSeed: "seed-aurora-7", body: "this is the most useful advice I've gotten all semester", createdAt: Date.now() - 0.2 * HOUR, upvotes: 56 },
  { id: "c4", postId: "p1", authorSeed: "seed-comet-1", body: "go to office hours. tell the truth. they've seen worse. trust.", createdAt: Date.now() - 0.15 * HOUR, upvotes: 203 },
  { id: "c5", postId: "p1", authorSeed: "seed-static-2", body: "gradient field = arrows pointing uphill on a surface. you got this.", createdAt: Date.now() - 0.1 * HOUR, upvotes: 312 },
  { id: "c6", postId: "p2", authorSeed: "seed-glass-1", body: "wear the thing. you know the thing.", createdAt: Date.now() - 1 * HOUR, upvotes: 220 },
  { id: "c7", postId: "p2", authorSeed: "seed-halo-6", body: "second floor is a power move. respect.", createdAt: Date.now() - 0.9 * HOUR, upvotes: 180 },
];

export function commentsFor(postId: string): Comment[] {
  return comments.filter(c => c.postId === postId);
}

export const me = {
  seed: "you-seed-001",
  alias: aliasFromSeed("you-seed-001"),
  joinedAt: Date.now() - 90 * 24 * HOUR,
  karma: 4231,
  posts: 12,
  comments: 184,
};

export type Notification = {
  id: string;
  kind: "reply" | "upvote" | "repost" | "mention";
  authorSeed: string;
  postId: string;
  preview: string;
  createdAt: number;
  read?: boolean;
};

export const notifications: Notification[] = [
  { id: "n1", kind: "reply", authorSeed: "seed-tender-3", postId: "p1", preview: "literally me. I just nod when anyone says 'parameterize'.", createdAt: Date.now() - 10 * 60_000 },
  { id: "n2", kind: "upvote", authorSeed: "seed-comet-1", postId: "p1", preview: "upvoted your post", createdAt: Date.now() - 30 * 60_000 },
  { id: "n3", kind: "repost", authorSeed: "seed-iron-9", postId: "p5", preview: "reposted your post", createdAt: Date.now() - 2 * HOUR, read: true },
  { id: "n4", kind: "mention", authorSeed: "seed-halo-6", postId: "p2", preview: "mentioned you in a comment", createdAt: Date.now() - 6 * HOUR, read: true },
];
