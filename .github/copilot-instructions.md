This repository is based on TypeScript and Node.js. It is a CLI tool that also performs as REPL.

## Code Standards

### Required Before Each Commit

- Run `npm run check` to confirm general functionality.

## Key Guidelines

- Stay consistent with the existing code style.
- All files are accompanied by \*.spec.ts files at the same location with unit tests.
  - All unit tests are wrapped with a global describe block named after the component under test (class name or the file name if not a class).
  - Unit tests are grouped by the method they are testing.
