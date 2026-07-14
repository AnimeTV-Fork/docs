# Contributing Guidelines

Guidelines for contributing code and submitting changes.

## Development Workflow

1. Fork this repository and clone it.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Verify lint and run testing builds locally before making a commit.
4. Keep commits small and document refactors or architectural shifts.
5. Create a Pull Request against the `main` branch.

## Code Standards
* **Strict Decoupling**: Keep presentation modules pure and free of platform WebView binding references.
* **Typing**: Make full use of TypeScript definitions inside the core architecture in `src/`.
* **Standard Naming Rules**:
  * Prefix shared elements with `app_`
  * Prefix anime-specific elements with `anime_`
  * Prefix movies-specific elements with `movies_`