## 🎯 Context & Motivation
Why does this change need to happen? What problem does it solve?

## 🔧 Approach
How did you solve it? Any notable design decisions or trade-offs?

## 🔗 Linked Issue
Closes #

## ✅ Definition of Done
> For non-code changes (`chore`, `docs`, `ci`) skip Code Quality, Testing, and Manual Testing.

**Code Quality**
- [ ] `uv run ruff check .` passes
- [ ] `uv run ruff format --check .` passes
- [ ] `uv run mypy src/` passes

**Testing**
- [ ] Full suite passes: `uv run python3 -m pytest tests/ -q`
- [ ] Coverage ≥ 80%
- [ ] New functionality has tests / bug fix has a regression test

**Documentation**
- [ ] `README.md`, `CONTRIBUTING.md`, `docs/ARCHITECTURE.md` updated where applicable
- [ ] ADR recorded in `docs/adr/` if an architectural decision was made

**Commit & Branch Conventions**
- [ ] All commits follow Conventional Commits
- [ ] Branch prefix matches commit type (e.g. `feat/` → `feat:`)
- [ ] Branch name includes the issue ID as a suffix (e.g. `feat/my-feature-123`)

**Manual Testing**
- [ ] Where applicable, manually tested by the author, the reviewer, and any other involved stakeholders
