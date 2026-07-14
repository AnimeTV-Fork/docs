> [!IMPORTANT]
> **Automatic Deployment Filter:** This site only builds and deploys to GitHub Pages when commit messages start with the **`build:`** prefix (e.g., `build: fixed typo`). Other commits bypass deployment to save run minutes.

# AnimeTV Developer Documentation

This repository contains the source code for the AnimeTV Developer Documentation, built using VitePress.

It serves as the central hub for developers to understand the project architecture, access build commands, configure TV D-pad navigation, write webview scrapers, and follow guidelines.

## Getting Started

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run docs:dev
   ```

3. **Build Static Site**
   ```bash
   npm run docs:build
   ```

4. **Preview Build Locally**
   ```bash
   npm run docs:preview
   ```

---

## Deployment & CI/CD Workflow

This documentation is deployed automatically to GitHub Pages.

### Commit Message Requirement
To save CI run minutes and prevent unnecessary builds, the GitHub Actions deployment workflow is restricted. It will **only run** if:
* The workflow is triggered manually via **Workflow Dispatch**.
* The head commit message starts with the **`build:`** prefix (e.g. `build: update architecture docs`).

Other commits will skip the build and deployment process.

---

## Repository Structure

* `.github/workflows/deploy.yml` — GitHub Actions deployment pipeline.
* `.vitepress/` — VitePress routing, sidebars, search configuration, and purple branding theme files.
* `guide/` — The markdown source files for developer documentation:
  * `getting-started.md` — Setup, prerequisites, and developer guide.
  * `build-guide.md` — Building for Android TV/Mobile and Windows.
  * `architecture.md` — Clean architecture pattern breakdown.
  * `dpad-navigation.md` — Spatial grid remote control algorithms.
  * `webview-scraping.md` — CronetEngine and JS injection scraper systems.
  * `naming-refactor.md` — Naming conventions and deprecation roadmaps.
  * `contributing.md` — Branch policies and commit formats.
  * `governance.md` — RFC process and community governance.
  * `roadmap.md` — Roadmap priorities and remaining checklist tasks.

---

## Contributing Guide

We welcome contributions to keep these docs comprehensive and accurate.

1. **Create a Branch**: Use prefixes like `docs/` (e.g., `docs/add-android-tips`).
2. **Make Changes**: Follow formatting standards. Verify compilation locally using `npm run docs:build` before pushing.
3. **Commit Message Format**: If your changes should be deployed immediately to the public site, ensure your commit message is prefixed with **`build:`**.
4. **Submit a PR**: Open a Pull Request targeting the `main` branch.
