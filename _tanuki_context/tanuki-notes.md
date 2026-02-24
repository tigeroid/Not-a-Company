# Tanuki Notes — not_a_company
# Written by Tanuki. Do not edit manually.
# Last updated: 2026-02-24

## Project Status
- **Standalone GitHub repo**: `https://github.com/tigeroid/Not-a-Company`
- **Visibility**: Private, with trusted collaborators. Potential future public release.
- **Notion integration**: Live. README.md auto-syncs to Notion on push to main via GitHub Actions.
- **Tanuki role**: This project is excluded from the portfolio GitHub repo. Managed independently.

---

## Security — IMPORTANT

### .env credentials
The `.env` file contains live credentials:
- `NOTION_API_KEY` — Notion integration token
- `NOTION_PAGE_ID` — Target Notion page

`.env` is correctly in `.gitignore` — never committed. GitHub Actions uses `secrets.NOTION_API_KEY` and `secrets.NOTION_PAGE_ID` set in the repo settings.

**Before going public:** Rotate these credentials in Notion and re-set the GitHub repo secrets. Existing secrets in a private repo are safe, but rotation on visibility change is good hygiene.

---

## Going Public — Checklist

When Henry decides to make `tigeroid/Not-a-Company` public, work through this list first:

- [ ] **Rotate Notion credentials** — rotate `NOTION_API_KEY` in Notion developer settings, update GitHub repo secret
- [ ] **Confirm `.bmad/` and `.claude/` are not tracked** — fixed 2026-02-24, but verify with `git ls-files | grep -E "^\.(bmad|claude)/"` before pushing
- [ ] **Review session/working notes** — the following files are currently tracked and will become public:
  - `cringe-or-not.md` — internal tone discussion with BMAD agents
  - `flow-discussion-2025-11-26.md` — internal brainstorming session
  - `manifesto-v2-draft.md` — draft iteration
  - `Flow.txt` — reference note
  - `docs/explorations/` — exploration docs
  Decide: keep them (transparent process, fits the brand), or move to untracked folder.
- [ ] **Review CONTRIBUTING.md** — currently states "This is a movement." Check tone is right for public.
- [ ] **Check `publish-to-notion.js`** — no hardcoded secrets (confirmed), but review for any logic you don't want public.
- [ ] **Decide on `package-lock.json`** — standard to include, fine to keep.

---

## Tech Debt Fixed (2026-02-24)

- `.bmad/` (68 files) and `.claude/` (16 files) were previously tracked in git — unintentionally public on GitHub.
- Fixed: added both to `.gitignore`, ran `git rm --cached -r .bmad/ .claude/`.
- **ACTION REQUIRED**: Henry needs to commit and push this change to remove them from the remote repo.
  ```
  git add .gitignore
  git commit -m "fix: remove .bmad and .claude from tracking"
  git push
  ```

---

— Tanuki
  The Ledger: 2026-02-24
