## Description
<!-- Please include a summary of the changes you are proposing. If it fixes an open issue, please link it here (e.g., "Fixes #123"). -->

Phase 1 MVP backend foundation for BookMyVenue — monorepo with `backend/` (API) and `frontend/` (placeholder).

**Backend:** REST API with auth (JWT), venues CRUD, bookings (create, list, cancel, availability). MVC: routes → controllers → services → repositories. See `backend/README.md` — run all commands from `backend/`.

## Phase Category
<!-- Which phase does this Pull Request belong to? Check one: -->
- [x] Phase 1: MVP Submission (Base Foundation)
- [ ] Phase 2/3: Feature Implementation or Modularization
- [ ] Phase 4: Scalability Optimization
- [ ] General (Documentation, Bugfix, Chore, etc.)

## Tech Stack (For Phase 1 MVP Submissions)
<!-- If submitting an MVP, please list the tech stack you used. -->
*(Example: Frontend: React, Backend: Node.js, Database: MongoDB)*

- **Frontend:** Will be updated soon (placeholder folder only)
- **Backend:** Node.js, Express 5 (ESM), Prisma ORM, JWT, bcrypt, express-validator
- **Database:** PostgreSQL 15

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [x] New feature / Module (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Checklist:
- [x] I have read the [Contribution Guidelines](CONTRIBUTING.md).
- [x] My code follows the community spirit and standards of the WeCode community.
- [x] I have performed a self-review of my own code.
- [x] I have commented my code, particularly in hard-to-understand areas.
- [x] My changes generate no new warnings or errors.

## AI Disclosure
<!-- WeCode encourages the use of AI tools to boost productivity, but you must review and understand the code you submit! -->
- [ ] I did **NOT** use AI tools to generate this code.
- [x] I used AI tools (e.g., Copilot, ChatGPT, Claude) to help write this code, and I have fully reviewed, tested, and understand the output.

## Screenshots / Screen Recording (if applicable)
<!-- If your PR introduces UI changes, please drop screenshots or a quick GIF/video recording here to help reviewers. -->

N/A — backend-only PR, no UI for now. API testing via curl examples in `backend/README.md`.
