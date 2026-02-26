import Image from "next/image";
import { Globe, MapPin } from "lucide-react";
import { XIcon } from "@/components/icons";
import type { GitHubUser } from "@/lib/github";

function cleanBlogUrl(blog: string): string {
  return blog.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function ensureBlogHref(blog: string): string {
  if (/^https?:\/\//.test(blog)) return blog;
  return `https://${blog}`;
}

interface AuthorFooterProps {
  user: GitHubUser | null;
}

export function AuthorFooter({ user }: AuthorFooterProps) {
  if (!user) return null;

  const displayName = user.name || user.login;
  const hasBlog = user.blog && user.blog.trim().length > 0;
  const hasSocials = user.location || hasBlog || user.twitter_username;

  return (
    <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-900">
      <div className="flex items-start gap-4">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={40}
          height={40}
          className="rounded-full shrink-0"
        />

        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              {displayName}
            </span>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-neutral-500 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
            >
              @{user.login}
            </a>
          </div>

          {user.bio && (
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
              {user.bio}
            </p>
          )}

          {hasSocials && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-neutral-500 dark:text-neutral-500">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="shrink-0" />
                  {user.location}
                </span>
              )}
              {hasBlog && (
                <a
                  href={ensureBlogHref(user.blog!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                >
                  <Globe size={14} className="shrink-0" />
                  {cleanBlogUrl(user.blog!)}
                </a>
              )}
              {user.twitter_username && (
                <a
                  href={`https://x.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                >
                  <XIcon className="shrink-0" />
                  @{user.twitter_username}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
