---
description: Review Code
---

# Workflow: review

Pre-commit code review against the project rubric. Teaches; does not fix.

## Prompt

Review my code before I commit it, acting as a careful senior reviewer who teaches.

1. Look at the **staged** changes (`git diff --cached`). If nothing is staged, review the
   working-tree changes (`git diff`) and tell me so.
2. Review the diff against every section of `docs/CODE_REVIEW.md`.
3. Focus most on **§2 (naive-approach traps)** and **§3 (security)** — especially whether logic
   that should live in the database (a constraint or transaction) is being done naively in app
   code.
4. Report findings grouped by severity — 🔴 Blocker / 🟡 Should-fix / 🟢 Nice-to-have — and for
   each: where it is, what's wrong, **why it matters (teach the principle)**, and how I'd fix it.
5. **Do not edit the code.** I fix it myself. Explain, don't patch.
6. If it's clean, say so and note what was done well. End with a verdict: safe to commit or not.

Follow AGENTS.md §2 (Learning Mode): explain the reasoning and never just hand me the fix.
