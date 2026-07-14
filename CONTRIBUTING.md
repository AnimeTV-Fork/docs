# Contributing to AnimeTV

Thank you for your interest in contributing to AnimeTV! This document outlines our development process and guidelines.

## 🚨 Golden Rules

1. **Never push directly to `main`** — All changes must go through Pull Requests
2. **At least 1 maintainer approval required** before merging any PR
3. **No force pushes to `main`** — History must be preserved
4. **No self-merging** — You cannot approve and merge your own PR

## 🔒 Code Confidentiality

This is a **private repository**. By contributing, you agree to:
- Never share, copy, or redistribute the source code
- Never discuss implementation details of scraping/source logic publicly
- Never fork this repo to a personal account

Violations will result in immediate access revocation.

## 🛠️ Development Workflow

### 1. Create a Branch

```bash
# Always branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

Branch naming convention:
- `feature/description` — New features
- `fix/description` — Bug fixes
- `refactor/description` — Code refactoring
- `docs/description` — Documentation changes

### 2. Make Your Changes

- Keep commits focused and atomic
- Write clear commit messages using [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: add new source provider`
  - `fix: correct stream type detection`
  - `refactor: modularize interceptor logic`
  - `docs: update setup instructions`

### 3. Push and Create a Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a PR on GitHub targeting `main`.

### 4. PR Requirements

Your PR must include:
- [ ] Clear description of what changed and why
- [ ] Testing evidence (screenshots, logs, or test results)
- [ ] No unrelated changes bundled in

### 5. Review Process

- Another maintainer will review your PR
- Address any feedback by pushing additional commits
- Once approved, the **reviewer** merges the PR (not the author)
- Use "Squash and merge" for clean history

## 🏗️ Project Structure

```
├── app/              # Android TV app (Java + WebView)
├── electron/         # Desktop app (Electron)
├── src/              # Clean architecture TypeScript core
├── scripts/          # Build scripts
├── tools/            # Development/debug utilities (not shipped)
└── dist/             # Built outputs
```

## 🧪 Testing

Before submitting a PR:
```bash
# Run unit tests
npm test

# Build all targets to verify nothing breaks
npm run build:all
```

## 💬 Communication

- Use GitHub Issues for bug reports and feature requests
- Use PR comments for code-specific discussions
- Tag maintainers if you need help

## 🚀 Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Read the `ARCHITECTURE_ROADMAP.md` for project context
4. Pick an open issue or discuss a new idea in Issues
5. Start coding!

---

_These rules exist to protect the project and maintain quality. Thank you for respecting them._
