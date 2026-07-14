# Project Governance

This document describes the governance structure of the AnimeTV project.

## Roles

### 🏛️ Founder / Owner
**@k-nacion**

- Full administrative access to the repository and organization
- Oversight role — not involved in day-to-day decisions unless choosing to be
- Reserves the right to veto any decision (but will rarely exercise it)
- Can grant/revoke access at any time
- Final authority on project direction if disputes arise

### 🔧 Maintainers

Maintainers are trusted community members who handle day-to-day development.

**Responsibilities:**
- Review and merge Pull Requests
- Triage issues and bugs
- Make architectural decisions
- Release new versions
- Mentor contributors

**Permissions:**
- Write access to the repository
- Can create branches, review PRs, and merge approved PRs
- Cannot push directly to `main` (by process agreement)

**Current Maintainers:**
- _(To be filled as community grows)_

### 👥 Contributors

Anyone invited to the organization who contributes code.

**Permissions:**
- Write access (can push branches, create PRs)
- Cannot merge without maintainer approval (by process agreement)

## Decision Making

### Day-to-Day Decisions
- Maintainers have full authority on implementation details
- Decisions are made via PR reviews and discussions
- If maintainers disagree, a simple majority vote decides

### Architectural Decisions
- Major architectural changes should be discussed in a GitHub Issue first
- At least 2 maintainers must agree before proceeding
- Document decisions in relevant `*.md` files or PR descriptions

### Disputes
- If maintainers cannot reach consensus, the Founder makes the final call
- This is a last resort, not a regular process

## Becoming a Maintainer

1. Be an active contributor for a sustained period
2. Demonstrate good judgment in PR reviews and code quality
3. Be nominated by an existing maintainer
4. Approved by the Founder

## Removing a Maintainer

A maintainer may be removed if they:
- Violate the code confidentiality agreement
- Consistently ignore contribution guidelines
- Are inactive for an extended period without notice
- Act in bad faith against the project

Removal is decided by the Founder.

## Process Enforcement

Since we operate on GitHub Free (no enforced branch protection on private repos), our rules are **trust-based**:

| Rule | Enforcement |
|------|-------------|
| No direct pushes to main | GitHub Action will flag violations |
| PRs require 1+ approval | Social agreement + automated reminders |
| No self-merging | Automated check via GitHub Action |
| No force pushes | Trust + git reflog auditing |

Violations are treated seriously. Repeated violations lead to access revocation.

## Communication

- **GitHub Issues** — Bug reports, feature requests, discussions
- **Pull Request comments** — Code-specific discussions
- **GitHub Discussions** (if enabled) — General project talk

---

_This governance model is designed to let the project run independently while the Founder retains oversight. Think of it as a benevolent dictatorship with delegated authority._
