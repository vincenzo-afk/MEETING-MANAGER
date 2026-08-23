# Contributing to Meeting Manager

Thank you for helping improve Meeting Manager. Contributions should preserve the application's client-side, local-first design unless a change explicitly proposes a broader architecture.

## Development setup

Use the repository's locked dependency tree and available scripts:

```bash
git clone https://github.com/vincenzo-afk/MEETING-MANAGER.git
cd MEETING-MANAGER
npm ci
npm run dev
```

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

The repository currently has no automated test suite. For user-interface changes, manually verify the Scheduler, Dashboard, Reports, local persistence, and relevant export actions.

## Branches and commits

Create a focused branch from `main`, using a short descriptive name such as `feat/report-filters`, `fix/export-filename`, or `docs/readme`. Keep commits small and action-oriented. Conventional Commit-style prefixes such as `feat:`, `fix:`, `docs:`, `refactor:`, and `chore:` are recommended.

## Pull requests

A pull request should explain the problem, summarize the implementation, and identify any user-facing behavior changes. Include screenshots or a short recording for visual changes. State the commands you ran and their results, and call out changes to the stored meeting shape, export format, or browser compatibility.

Please avoid committing generated `dist/` output, dependency directories, local environment files, or meeting data. Do not include real client information in examples, screenshots, fixtures, or issue reports.

## Review expectations

Changes should be narrowly scoped, readable, accessible, and consistent with the existing React, Vite, and Tailwind CSS conventions. A maintainer may request revisions when a change introduces unverifiable documentation, breaks the localStorage format, changes export semantics without explanation, or does not pass lint and build checks.

## Reporting issues

Use [GitHub Issues](https://github.com/vincenzo-afk/MEETING-MANAGER/issues) for reproducible bugs and feature proposals. Do not disclose sensitive client information or vulnerability details in a public issue; follow [SECURITY.md](SECURITY.md) for private reports.
