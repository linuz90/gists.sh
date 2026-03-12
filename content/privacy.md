# Privacy Policy

**Last updated:** March 12, 2026

gists.sh is a free, open-source tool that renders GitHub Gists with clean formatting. It's built and maintained by [Fabrizio Rinaldi](https://fabrizio.so).

## What gists.sh does

When you visit a gist URL on gists.sh, the site fetches that gist's content from the GitHub API and renders it for you. That's it. There are no user accounts, no login, no forms, and no cookies.

## Analytics

Gist pages have zero analytics or tracking. No scripts, no pixels, nothing.

The landing page (gists.sh homepage only) uses [Vercel Web Analytics](https://vercel.com/docs/analytics) to understand aggregate traffic (page views, referrers). Vercel Analytics is privacy-focused:

- No cookies are used
- No personal identifiers are collected
- No cross-site or cross-app tracking
- Data is aggregated and anonymous
- IP addresses are hashed temporarily and discarded within 24 hours

You can read more about how Vercel handles analytics data in their [privacy and compliance docs](https://vercel.com/docs/analytics/privacy-policy).

## Server logs

As with any website hosted on Vercel, standard server logs (IP address, user agent, timestamps) may be collected by Vercel's infrastructure for security and operational purposes. These are subject to [Vercel's Privacy Policy](https://vercel.com/legal/privacy-policy).

## Data we store

None. gists.sh does not have a database. It does not store any user data. Gist content is fetched from GitHub on demand and cached temporarily via ISR (Incremental Static Regeneration) for performance.

The only client-side storage is `localStorage` for your display preferences (theme, header/footer visibility), which never leaves your browser.

## Third parties

- **GitHub API**: used to fetch gist content. Subject to [GitHub's Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).
- **Vercel**: hosting and analytics (landing page only). Subject to [Vercel's Privacy Policy](https://vercel.com/legal/privacy-policy).

No data is sold, shared with advertisers, or used for tracking.

## Contact

Questions? Reach out to [hey@fabrizio.so](mailto:hey@fabrizio.so).
