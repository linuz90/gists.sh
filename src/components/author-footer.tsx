import type { GitHubUser } from "@/lib/github";

function LocationIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

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
        <img
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
              className="text-sm font-mono text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
            >
              @{user.login}
            </a>
          </div>

          {user.bio && (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
              {user.bio}
            </p>
          )}

          {hasSocials && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-neutral-400 dark:text-neutral-500">
              {user.location && (
                <span className="flex items-center gap-1">
                  <LocationIcon />
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
                  <LinkIcon />
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
                  <XIcon />
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
