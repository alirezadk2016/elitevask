# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # local dev server
npm run build    # production build (run before committing to catch errors)
npm run lint     # ESLint via next lint
```

No test suite is configured. Verify changes with `npm run build`.

## Git

Always set author identity before committing:
```bash
git config user.email noreply@anthropic.com
git config user.name Claude
```

Development branch: `claude/dazzling-cori-1cokr3`. Push to that branch AND force-push to `main`:
```bash
git push -u origin claude/dazzling-cori-1cokr3
git push --force origin main
```

## Architecture

**Next.js 16 App Router** (`src/app/`). No TypeScript — plain JS/JSX throughout.

### Styling
All styles are in `src/app/globals.css` using plain CSS variables (`--green`, `--line`, etc.). Admin panel uses **inline styles only** — no CSS modules, no Tailwind.

### Data flow (public site)
1. `src/lib/siteInit.js` — runs client-side, contains hardcoded defaults for prices, FAQ, extras. Accepts an `overrides` object to replace defaults with KV data.
2. `src/components/SiteScripts.jsx` — fetches `/api/site-content` then calls `initSite(overrides)`. This is the bridge between KV and the DOM-manipulating legacy init script.
3. `src/app/api/site-content/route.js` — public endpoint that reads `content:faq`, `content:prices`, `content:extras` from KV and returns them with 60s cache.

### Admin panel
- Route: `/admin/content` → `src/app/admin/content/page.js` (`"use client"`)
- Auth: `sessionStorage.getItem("adm")` compared against `ADMIN_SECRET` env var; all API calls use `Authorization: Bearer <secret>`
- Admin API: `src/app/api/admin/content/route.js` — CRUD for gallery, videos, faq, extras, packages (prices)
- Middleware-equivalent security: `src/proxy.js` (imported by `src/middleware.js` equivalent — the exported `proxy` function acts as Next.js middleware)

### KV storage keys
| Key | Type | Content |
|-----|------|---------|
| `content:gallery` | array | `{id, url, caption, album, source, uploadedAt}` |
| `content:videos` | array | `{id, url, caption}` |
| `content:faq` | array | `{id, q:{da,en}, a:{da,en}}` |
| `content:extras` | array | `{id, name:{da,en}, desc:{da,en}, price}` |
| `content:prices` | object | `{lille:{hele,udv,indv,guld}, mellem:{...}, stor:{...}, varebil:{...}}` |
| `session:<hash>` | object | customer portal sessions |

### Package and car type IDs
- **Packages**: `hele`, `udv`, `indv`, `guld` — do NOT use basis/komplet/premium/deluxe
- **Car types**: `lille`, `mellem`, `stor`, `varebil`

### FAQ/Extras nested format
Always save and read in nested bilingual format: `{da: "...", en: "..."}`. The admin UI uses flat draft fields (`qDa`, `qEn`, `aDa`, `aEn`) internally then saves nested.

### Customer portal
- Routes under `/portal/` — guarded by `ev_session` cookie (checked in `src/proxy.js`)
- Session logic in `src/lib/auth.js`; magic-link auth via `src/lib/mailer.js`

### Environment variables required
`ADMIN_SECRET`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `BLOB_READ_WRITE_TOKEN`, `EMAIL_*` (nodemailer), `NEXT_PUBLIC_BASE_URL`
