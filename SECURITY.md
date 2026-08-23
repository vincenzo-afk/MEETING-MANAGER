# Security Policy

## Scope

Meeting Manager is a client-side React application. Meeting records are stored in the browser's `localStorage` under the key `meeting_manager_meetings`; the application does not provide authentication, encryption, a server-side database, or a backend API.

Because data is local to the browser profile, users should protect the device and browser profile where the application is used. Do not enter sensitive information unless the storage environment is appropriate for it, and keep exported JSON and Excel backups in trusted locations.

## Reporting a vulnerability

Please report suspected security vulnerabilities privately to [itsmebk2007@gmail.com](mailto:itsmebk2007@gmail.com). Include a concise description, affected files or behavior, reproduction steps that do not contain real client information, and any suggested mitigation.

Please do not open a public issue for an unpatched vulnerability or attach confidential data to a report. This project does not currently publish a guaranteed response time or a supported-version matrix.

## Dependency hygiene

The repository uses a committed `package-lock.json` and runs `npm ci` in continuous integration. Dependency advisories should be reviewed with `npm audit` before applying upgrades; upgrades must be validated with `npm run lint` and `npm run build`.
