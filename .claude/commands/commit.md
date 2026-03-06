Review all uncommitted changes in git. Understand what each changed file does, group related changes together logically, stage them, write clear commit messages, and commit them.

**Speed rule: Skip any step whose output you already have from the current session.** Don't re-run git status, git diff, or tests you just ran. Go straight to what's needed.

## Phase 1: Understand Changes (main context)

1. Run `git status` and `git diff` to see all changes
2. Analyze and understand what each file change does. **Regression check:** For deleted or replaced code, verify no functionality is lost. Focus on: event handlers, conditional branches, return values, and side effects. If a function was refactored, check that callers still work. Fix any regressions before proceeding.
3. **Behavioral compliance check:** Read `CLAUDE.md` and cross-reference the "Key Behaviors", "Code Rules", and "Exports" sections against the diff. Every rule documented there must still hold after the changes. Flag any violation where the diff would break a documented behavior or rule. If violations are found, print a clear summary listing each violation, then fix them. If no violations, print "No behavioral violations found." and move on. Skip if changes are only in `docs/`, `.claude/`, `tests/`, or config files.
4. **API stability check:** If any exported type or prop interface changed, verify backward compatibility with jogi's consumer setup (documented in CLAUDE.md under "Consumer Setup"). Breaking changes require explicit user approval.

## Phase 2: Validate (parallel subagents)

Launch these as **parallel Task subagents**. Use the diff from Phase 1 to determine what each agent needs to do.

**Agent A — Unit tests** (Bash subagent):
Run `npm test`. Report pass/fail and any failure output.

**Agent B — Build** (Bash subagent):
Run `npm run build`. Report pass/fail and any errors.

**Agent C — Type check** (Bash subagent):
Run `npx tsc --noEmit`. Report pass/fail and any type errors.

## Phase 3: Commit (main context)

If any agent reported failures, fix the issues and re-run only the failing agent.

1. Group related changes (e.g., feature work, bug fixes, refactors, docs)
2. Stage each group separately with `git add`
3. Write a descriptive commit message following conventional commits (feat, fix, refactor, docs, chore)
4. Commit with a clear message explaining the "why" not just the "what"
5. Run `git push` to sync with remote

**IMPORTANT: DO NOT PUSH IF ANY TEST OR BUILD FAILS.** Fix all issues before pushing.

If there are unrelated changes, create multiple commits. Always include the co-author line.
