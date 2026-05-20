# Contributing to GraphQL Journey

First off — thank you for being here. This repo is built for learning, and every contribution that makes it clearer, more accurate, or more useful is genuinely valued.

---

## What you can contribute

- Fix typos or incorrect information in any README or notes file
- Improve explanations to make them clearer for beginners
- Add new code examples to any topic's `examples/` folder
- Add exercises to any topic's `exercises/` folder
- Suggest new topics or improvements via GitHub Issues
- Fix bugs in any example code

---

## How to contribute

### 1. Fork the repository

Click **Fork** on GitHub to create your own copy.

### 2. Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/graphql-journey.git
cd graphql-journey
```

### 3. Create a branch

Name your branch clearly — describe what you're changing:

```bash
git checkout -b fix/resolver-typo
git checkout -b add/queries-variables-example
git checkout -b improve/mongodb-explanation
```

### 4. Make your changes

Follow the standards below, then commit:

```bash
git add .
git commit -m "fix: correct typo in resolver README"
git push origin your-branch-name
```

### 5. Open a Pull Request

Go to the original repo on GitHub and open a Pull Request. Describe what you changed and why.

---

## Standards to follow

### File structure

Every topic folder follows this structure — please keep it consistent:

```
topic-name/
├── README.md        ← explanation of the concept
├── notes.md         ← key takeaways
├── examples/        ← runnable code files
└── exercises/       ← challenges
```

### Writing style

- Write for a **beginner** — assume they know JavaScript but not GraphQL
- **Explain before you code** — always describe what something is before showing the code
- Use **simple language** — no unnecessary jargon
- Add **comments in every code file** — every non-obvious line should be explained
- Keep explanations **accurate** — if you're not sure, ask in an Issue first

### Code standards

- All JavaScript uses **ES Modules** (`import`/`export`) unless the topic requires CommonJS
- Use `const` and `let` — never `var`
- Include a `package.json` in every `examples/` folder that has runnable code
- Test that your code actually runs before submitting

### Commit message format

```
type: short description

Types: fix | add | improve | remove | docs
```

Examples:
- `fix: correct schema type in queries example`
- `add: cursor pagination example`
- `improve: simplify resolver chain explanation`
- `docs: add notes for authentication topic`

---

## Reporting issues

Found something wrong or confusing? Open a GitHub Issue with:

1. Which file or folder the issue is in
2. What the current content says
3. What it should say or do instead

---

## Questions?

If you're unsure about something before contributing, open an Issue and ask. There are no bad questions here — this is a learning repo after all.
