# 🎓 Planer

University schedule planner for Wrocław University of Science and Technology students, built by [KN Solvro](https://solvro.pwr.edu.pl/).

[![Welcome Page](https://i.imgur.com/dVjBfjS.png)](https://planer.solvro.pl)

**[planer.solvro.pl](https://planer.solvro.pl)** · [Project portfolio](https://solvro.pwr.edu.pl/portfolio/planer/) · [Docs](https://docs.solvro.pl)

## Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![Coolify](https://img.shields.io/badge/Coolify-FF0000?style=flat-square&logo=coolify&logoColor=white)

## Getting Started

```bash
git clone git@github.com:Solvro/web-planer.git
cd web-planer
pnpm install
cp .env.example .env   # fill in USOS_*, BETTER_AUTH_SECRET, etc.
docker compose up -d   # postgres + redis
pnpm dev
```

App runs at [localhost:3000](http://localhost:3000).

## Contributing

1. Fork the repo, branch off `main` as `type/short-description` (e.g. `feat/course-filters`, `fix/login-redirect`)
2. Commit using [Conventional Commits](https://docs.solvro.pl/git-github/solvro#nazewnictwo-commit%C3%B3w) (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `ci:`, `build:`) — commitlint enforces this
3. Push to your fork, open a PR — CI runs checks automatically
4. Never push directly to `main`

Full workflow: [Solvro GitHub Handbook](https://docs.google.com/document/d/1Sb5lYqYLnYuecS1Essn3YwietsbuLPCTsTuW0EMpG5o/edit?usp=sharing)

## Contributors

[![Contributors](https://contrib.rocks/image?repo=Solvro/web-planer)](https://github.com/Solvro/web-planer/graphs/contributors)

## Contact

📧 [kn.solvro@pwr.edu.pl](mailto:kn.solvro@pwr.edu.pl) · 🌐 [solvro.pwr.edu.pl](https://solvro.pwr.edu.pl/) · 📘 [Facebook](https://www.facebook.com/knsolvro)
