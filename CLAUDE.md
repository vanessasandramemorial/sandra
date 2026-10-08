# Claude guidance for sandraaponte.org

@AGENTS.md

## Project context

A memorial site for Sandra Ivelisse Aponte Santiago (1952–2026), maintained by her
daughter Vanessa. It is a fork of the Joe Weisman memorial
(github.com/jazzlw/joeweisman, the `upstream` remote). Next.js 16 (App Router,
TypeScript) on Vercel, deploying from `main` of the public repo
`vanessaperegrine/sandra`. The obituary renders from Markdown in `content/`; a photo
gallery and an "Art" gallery with public submissions, a guestbook, and email
collection are live (see `README.md` "The services" for what's deployed where).
There is no service page: the service is private.

The site is bilingual. English is at the bare paths and Puerto Rican Spanish, using
*usted*, mirrors it under `/es` — see `ARCHITECTURE.md` → "Two languages".

## Working with Vanessa

- **She reviews before anything is published.** Make changes locally, show them in
  the preview (`npm run dev -- -p 3117`), and push to `main` only when she says to
  publish. Pushing to `main` is publishing.
- **Every obituary change goes into both** `content/obituary.md` and
  `content/obituary.es.md`; every wording change into both halves of
  `src/lib/i18n.ts`.
- **Names kept off the site, permanently**, because the repo is public and history
  can't be taken back: Sandra's grandchildren, her daughters' husbands, and her
  former partners. No date or place for the service.
- **Confirming a deploy:** after a push, read the Vercel status with
  `gh api repos/vanessaperegrine/sandra/commits/<sha>/status`, then check the live
  page once in a browser. Don't poll the site with curl in a loop — Vercel's bot
  protection answers bursts with a "Security Checkpoint" page, which looks like a
  failed deploy.
- **Backups** go to a dated folder in `~/Documents` (never inside this repo), which
  she then drags into the memorial Gmail's Google Drive. See `README.md` → "Backups".

Treat the subject with care. The people reading this site are grieving, and much
of the content is about a real person recently dead. Plainness beats cleverness in
both the design and the copy.

`ARCHITECTURE.md` is the design document — the stack, data model, security
boundaries, and design system, as they are today. `PLAN.md` covers what's
still ahead. `historic/HISTORY.md` records what was chosen, what was
rejected, and why — read it (or `ARCHITECTURE.md`) before any structural
change. `README.md` covers running and deploying. `AGENTS.md` holds the
technical invariants and the reason behind each.

## Environment

Node 22 via fnm. Not Node 24 — it needs macOS 13.5+.

```bash
export PATH="$HOME/.local/bin:$PATH"
eval "$(fnm env --shell bash)"
fnm use 22
```

`npm run dev -- -p 3117`. Port 3117, not 3000 (by request of the original developer). Never kill a process by name to free a port; find another port. `.claude/launch.json` (local only, not committed) starts it for the preview pane.

In `.env.local`, never leave a comment on the same line as a value
(`KEY=   # note`): `scripts/*.mjs` read everything after `=` as the value, so
the comment becomes the credential. Put comments on their own line.

## Commands

| Command | What it does |
|---|---|
| `npm run dev -- -p 3117` | Dev server on port 3117 (see Environment above) |
| `npm run build` | Production build — run before pushing anything structural |
| `npm start` | Serve the production build locally |
| `npm run lint` | ESLint (`eslint-config-next` core-web-vitals + typescript) |
| `npm test` | Runs `tests/*.test.mts` on Node's built-in test runner, no test framework dependency |
| `npm run migrate` | Applies any unapplied numbered `.sql` file in `db/` against Neon |
| `npm run archive` | Copies any approved photo not yet backed up to R2 |
| `npm run dimensions` | Fills in pixel size for any photo missing it (`-- --all` re-measures everything) |
| `npm run archive -- --pull` | Downloads the whole R2 photo archive to `media/archive/` (gitignored) |

Single test file: `node --experimental-strip-types --test tests/turnstile.test.mts`.

Run `npm test` before pushing anything touching `src/lib/` — the tests cover the
parts where a mistake is expensive and silent (a rejected Turnstile token being
refused even under the lenient outage policy, an unset `ADMIN_PASSWORD` locking
everyone out, a failing notification never throwing).

## Architecture

**Content vs. app code.** `content/*.md` (the obituary in `obituary.md` and
`obituary.es.md`, and `how-to-make-this.md`) is read from the filesystem and
rendered by `src/lib/content.ts` via `marked` — this is the *only* place
`dangerouslySetInnerHTML` is used, because it's our own trusted Markdown. Internal
links in the Spanish obituary point at `/es/...` paths. Unfilled `XXXX`
placeholders in content are surfaced as build-log warnings by `content.ts`, not
build failures.

**Two languages, one set of views.** Every visitor-facing string lives in
`src/lib/i18n.ts`, typed so the `es` dictionary can't drift out of shape from
`en`. Each public route's markup is a `view.tsx` taking `lang`; `page.tsx` renders
it with `"en"` and the wrapper under `src/app/es/` with `"es"`. Route config
(`revalidate`, `dynamic`) must be repeated as a literal in both page files. Use
`localize(path, lang)` for internal links and `needsFullLoad` (which understands
`/es`) for Turnstile pages. Forms post a hidden `lang` field so server actions
answer in it; `verifyTurnstile` returns a `code` for the same reason. Any
`revalidatePath` must also clear the `/es` twin. Admin pages and admin emails are
English only.

**Feature module shape.** Each public form (`guestbook/`, `photos/`, `subscribe/`)
follows the same pattern: `page.tsx` (server component, plus its `/es` twin and a
shared `view.tsx`) + `form.tsx` (client component, Turnstile widget +
`useActionState`) + `actions.ts` (`"use server"`, validates input, calls a query
function in `src/lib/{feature}.ts`, then `revalidatePath` and an `after()`-deferred
admin email via `notify.ts`). Follow this shape for any new visitor-facing form
rather than inventing a new one.

**Data layer.** Neon Postgres, reached only through `src/lib/db.ts` (a lazy pooled
client) — the browser never touches the database directly. Schema changes are
numbered files in `db/` (`001_init.sql`, …), applied idempotently by
`scripts/migrate.mjs` via `npm run migrate`; there's no ORM. Per `ARCHITECTURE.md`
→ "Data model", the DB is temporary — the site freezes to static in year two
(`PLAN.md` has that plan) — so keep the schema flat and avoid features that
assume Postgres is permanent.

**Photos pipeline is two storage systems with distinct jobs**, per `ARCHITECTURE.md`
→ "The photo pipeline": R2 (`src/lib/r2.ts`, `scripts/archive.mjs`) holds every
original permanently as the private archive; Cloudflare Images (`src/lib/cf-images.ts`)
is the serving layer, populated only on admin approval, and handles HEIC
transcode/thumbnails/delivery. Visitor photos are never routed through `next/image` —
see `ARCHITECTURE.md` → "Security boundaries" — `next/image` is reserved for
curated assets (`public/`).

**Artifacts are photographs with a `kind`, not a second entity.** `photos.kind`
is `'photo' | 'artifact'`; `/photos` and `/artifacts` are the same `Gallery`
component over `getApprovedPhotos(kind)`, which takes the kind explicitly so a
third gallery can't silently start dropping rows out of an existing one. The
section is shown as "Art" / "Arte" (`nav.art` in `src/lib/i18n.ts`) and holds
Sandra's paintings and her glass mosaic; the `/artifacts` URL deliberately doesn't
follow the name, since that URL ends up in email and print.

**Submissions that aren't photographs go to `artifact_files`, never to
`photos`.** They have no Cloudflare Images id and no viewable derivative, so
putting them in `photos` would mean every gallery query and the archive job had
to learn to skip them — and the first one that slipped through would have a
gallery rendering an audio file as an `<img>`. They upload straight to R2 via a
presigned PUT (`presignPut` in `r2.ts`), because a server action on Vercel caps
its body near 1 MB. **Nothing in that table is ever served publicly and no route
should ever serve it** — a stranger-supplied `.html` or `.svg` on our own origin
is stored XSS, and extension filtering doesn't fix that; not serving them does.
The single exception is `/admin/files/[id]`, which is admin-gated and forces
`application/octet-stream` + `Content-Disposition: attachment` + `nosniff`
rather than trusting the uploader's claimed type. **This requires a CORS policy
on the R2 bucket** (`PUT` from the site origins) — without it the browser's
preflight fails and uploads report a connection error; see `README.md`.

**Admin auth is split across two files on purpose.** `src/lib/admin-password.ts`
holds the password/token crypto with no `next/*` imports, so it's unit-testable
outside the framework; `src/lib/admin-auth.ts` layers the cookie session on top and
imports `next/headers`. `src/app/admin` itself is unlinked, `noindex`, single
shared password — moderates guestbook entries (hide/restore) and photos
(approve/reject/delete), and exports the contacts CSV.

**Turnstile verification (`src/lib/turnstile.ts`) takes an explicit
`OutagePolicy`** (`"deny" | "allow"`) per call site — a `success: false` from
Cloudflare is always refused, but what happens when Cloudflare itself is
unreachable is a per-form judgment call. Guestbook denies on outage (entries
publish immediately to a public page); forms writing only to private data may
allow. Match this pattern for any new form rather than hardcoding one behavior.

**Link to a Turnstile page with a plain `<a>`, never `next/link`.** Turnstile's
implicit rendering scans for `.cf-turnstile` once, when its script executes, and
Next loads a `<Script>` exactly once per session — "even if a user navigates
between multiple routes", per its own docs. So after a client-side navigation the
script is already loaded, never re-runs, never scans, and the form gets a widget
container nothing will ever fill: `window.turnstile` defined, no widget, no token,
and "please complete the verification below" over empty space. Arriving by link
failed every single time and arriving by reload worked every single time, which
for months read as the form being intermittently broken. `needsFullLoad()` in
`src/lib/sections.ts` lists the three pages; the nav and every in-page link
honour it. Don't turn them back into `<Link>`.

**On the client, never probe Turnstile's DOM — check for `window.turnstile`.**
The widget renders into a *shadow root*, so `querySelector("iframe")` on its
container finds nothing no matter how well it is working. A poll written that way
tells every visitor the form is broken while the widget above it reads "Success!"
— which is exactly what happened, and it looks like an intermittent bug because
the message only appears once the timeout elapses. The only thing that status text
is really about is whether an extension blocked `challenges.cloudflare.com`, and
the missing global is precisely what that looks like. Related: the submit path in
`src/app/photos/form.tsx` always calls `waitForToken()` and never refuses to try
based on that status — the status picks the wording, it does not gate submission.
A token expires after 300s and this form takes longer than that to fill in, so
"looks unready" and "will fail" are different claims.

**A Turnstile token can only be validated once** — a replay comes back
`timeout-or-duplicate`. This is why `requestUploads` takes both the photo count
and the list of other files in a single call and issues Cloudflare Images
tickets and presigned R2 URLs together: two `verifyTurnstile` calls would need
two solved challenges, the second landing halfway through a submission that had
already started uploading. If a third kind of upload is ever added, widen that
one call rather than adding a second verification. The follow-up actions
(`recordPhotos`, `recordArtifactFiles`) don't verify at all — they authenticate
with the HMAC upload handle from `src/lib/upload-handle.ts`, which is what
carries the original verification across to the recording step.

**`/api/health`** is the UptimeRobot target — it returns 503 only for a real
visitor-facing outage (DB unreachable, or `TURNSTILE_SECRET` missing in prod).
Optional services being merely unconfigured report as `degraded` in the body
without tripping the alert; don't make this endpoint call out to Cloudflare Images
or Resend, since a periodic health check would burn their quota.

**Styling is one file, no build tooling.** All CSS lives in `src/app/tokens.css` —
no Tailwind, no CSS-in-JS (`AGENTS.md`). Fonts are committed `.woff2` files loaded
via `next/font/local` in `src/app/fonts.ts`, never `next/font/google` (that fetches
at build time, a year-three failure mode `ARCHITECTURE.md` → "Design system" explains).

## What must never be committed

**This repository is public, and git history cannot be taken back.** Removing a
file in a later commit does not remove it from history; once something is pushed,
it is out there for good.

Never commit, in any file:

- **Exports.** `/exports/` and any downloaded CSV. Real names and email
  addresses. Read them with `npm run rsvp`, which goes to the database instead.
- **Anything a visitor submitted** — a guestbook entry, an RSVP note, a photo
  caption, a submitter's name — outside the database it already lives in.
- **Secrets.** `.env.local`. `.env.example` is the committed template.
- **Design working files.** `/invitation/`, `*.ai`. Large binaries that sit in
  history forever, and the kind of file that quietly embeds a recipient list.
- **Backups.** The photo archive and database exports live outside the repo, in a
  dated folder under `~/Documents`.
- **Family names Vanessa has kept off the site** — see "Working with Vanessa".
- **Photographs with metadata.** Anything added to `public/` must have its EXIF
  stripped first; phone photos carry GPS coordinates and the camera model.

**The rule extends to code comments and commit messages, which is where it
actually goes wrong.** A good comment explains *why*, and the most convincing
why is a real example — so quoting four people's RSVP notes to justify why
`scripts/rsvp.mjs` does not pattern-match the notes column felt like careful
documentation. One of them named a living relative. It was caught by being asked
"what becomes public?" before the commit, not by anything automatic.

Make the argument in the abstract instead: "most people use 'we' to describe how
they knew Sandra, in the past tense" carries the same reasoning and quotes nobody.
If a real example seems necessary, invent one.

Before committing anything that touched submitted data, grep the staged diff for
names and addresses. `git diff --cached` is the last point at which this is free.

## Git commits

- **Run `git pull --ff-only origin main` before you edit anything. Not `fetch` —
  `pull`.** Changes can also arrive from GitHub's web editor or another machine.
  `git fetch` updates the remote-tracking ref and leaves the working copy exactly
  where it was, so it is possible to get a correct answer about the remote while
  still patching stale files. Reading the "behind by N commits" line is not enough
  either: knowing you are behind and editing anyway is the same bug. The original
  project lost a session's work this way.

  Pull at the start of the task, and pull again before a commit if any real time
  has passed.
- **Updates from the original project** come in with `git fetch upstream && git
  merge upstream/main` (see `FORKING.md` → "Staying in sync"). Files listed in
  `.gitattributes` stay ours automatically; everything else — including this file,
  the `view.tsx` files, and the pages whose strings moved into `src/lib/i18n.ts` —
  may conflict, because upstream is English-only. Resolve by keeping both
  languages working.
- **Do not include Claude attribution in commit messages.** No `Co-Authored-By`,
  no "Generated with" footer.
- **Never `git add -A` or `git add .`** — stage explicit paths, or `git add -u`.
- **Never force push** (`git push -f` / `--force`).
- **Never `git commit --amend`** — make a new commit.
- **Never `--no-verify`** — fix what the hook is complaining about.
- Always check `git status` before committing.
- Style: short subject line, blank line, body in bullet points explaining the *why*.
- `main` is published. See the warning at the top of `README.md` before pushing.

## Code editing

- **Never use sed, awk, or other command-line tools to edit files** — use the Edit tool.

## System access

- **Never run sudo commands directly** — ask user to run them.

## Shell commands

- **Never use `sleep`** — poll for the actual condition instead.

## Comments

- Comments describe the current state only — never reference what the code used to do.
