# BookMyVenue Git Workflow Guide

This guide explains the Git workflow every BookMyVenue team member should follow during Phase 1 MVP development.

---

## 1. Branch Strategy

We use three main branch types:

```txt
main       = stable MVP branch
dev        = integration branch
feature/*  = individual task branches
```

| Branch | Purpose | Direct push rule |
|---|---|---|
| `main` | Stable, submission-ready MVP | No direct push |
| `dev` | Integration branch for tested work | No direct push preferred |
| `feature/*`, `fix/*`, `docs/*`, `chore/*` | Individual work branches | Members push to their own branches |

All work should be done in a separate branch and merged through a Pull Request.

---

## 2. Starting a New Task

Before creating any new branch, always update your local `dev` branch first:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-task-name
```

Example:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/venue-model
```

This makes sure your new branch starts from the latest team code.

---

## 3. Daily Work Commands

Check your current branch:

```bash
git branch
```

Check changed files:

```bash
git status
```

Stage and commit your changes:

```bash
git add .
git commit -m "Add venue model"
```

Push your branch:

```bash
git push origin feature/venue-model
```

After pushing, go to GitHub and click Compare & pull request for your branch.

Set the PR direction correctly:

base: dev
compare: feature/your-feature-name

This means:

feature/your-feature-name → dev

Then add a clear PR title and description, and create the Pull Request.

---

## 4. Branch Naming Rules

Use clear branch names based on the type of work.

### Feature branches

```txt
feature/backend-setup
feature/venue-model
feature/venue-api
feature/nearby-search
feature/home-page
feature/venue-listing-ui
feature/auth-ui
feature/owner-dashboard
feature/admin-dashboard
```

### Bug fix branches

```txt
fix/venue-filter-bug
fix/login-error-handling
fix/navbar-mobile-layout
```

### Documentation branches

```txt
docs/api-contract
docs/readme-update
docs/setup-guide
```

### Chore branches

```txt
chore/env-example
chore/deployment-config
chore/package-cleanup
```

Avoid vague names:

```txt
new-branch
my-work
changes
update
final-code
```

---

## 5. Commit Message Rules

Write small, meaningful commit messages.

Good examples:

```txt
Add Express server setup
Add MongoDB connection config
Add Venue model
Add venue listing page
Connect venue listing to API
Fix venue card responsive layout
Update API contract for inquiry endpoints
```

Bad examples:

```txt
changes
done
final
updated code
my work
bug fix
```

---

## 6. If You Created a Branch Without Pulling Latest `dev`

### Case 1: No changes made yet

Delete and recreate the branch from latest `dev`:

```bash
git checkout dev
git pull origin dev
git branch -D feature/your-branch-name
git checkout -b feature/your-branch-name
```

### Case 2: Changes already made

Commit your work first:

```bash
git add .
git commit -m "Work in progress"
```

Update `dev` and merge it into your feature branch:

```bash
git checkout dev
git pull origin dev
git checkout feature/your-branch-name
git merge dev
```

Resolve conflicts if Git asks you to.

---

## 7. Keeping an Existing Feature Branch Updated

If another PR was merged into `dev` while you are still working, update your feature branch before opening your PR:

```bash
git checkout dev
git pull origin dev
git checkout feature/your-branch-name
git merge dev
```

Then test your code again.

After testing:

```bash
git add .
git commit -m "Merge latest dev into feature branch"
git push origin feature/your-branch-name
```

---

## 8. Handling Merge Conflicts

If Git shows conflicts, run:

```bash
git status
```

Open the conflicted files and look for conflict markers:

```txt
<<<<<<< HEAD
Your branch code
=======
Incoming dev code
>>>>>>> dev
```

Manually choose the correct code, remove the conflict markers, then run:

```bash
git add .
git commit -m "Resolve merge conflict with dev"
```

---

## 9. Files Rule

Never commit these files. Add these in .gitignore:

```txt
node_modules/
.env
.env.local
.DS_Store
dist/
build/
```

Commit these when relevant:

```txt
package.json
package-lock.json
.env.example
README.md
CONTRIBUTING.md
docs/api-contract.md
```

After pulling latest `dev`, run `npm install` only if `package.json` or `package-lock.json` changed in `client` or `server`.

For frontend dependency changes:

```bash
cd client
npm install
```

For backend dependency changes:

```bash
cd server
npm install
```

You do not need to run `npm install` after every pull if dependencies did not change.

---

## 10. Environment Variable Rule

Never commit `.env` to GitHub.

Use `.env.example` to show required variables without exposing real secrets.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

Each member should create their own `.env` file locally.

---

## 11. Pull Request Rules

Every PR should explain:

```txt
What was added
What was changed
How it was tested
Any pending issues
```

Example PR description:

```md
## What I did
- Added Venue model
- Added default venue status as pending

## Testing
- Checked model import
- Server runs without errors

## Notes
- Seed data will be added in another PR
```

Open PRs to:

```txt
your-branch → dev
```

---

## 12. PR Review Process

1. Member opens PR to `dev`.
2. Backend Lead / Integration Lead reviews the PR.
3. Reviewer checks:

```txt
Does the code match the assigned task?
Does the app still run?
Are unrelated files changed?
Are .env or node_modules committed by mistake?
Are folder structures preserved?
Does the API match docs/api-contract.md?
```

4. If changes are needed, reviewer comments on the PR.
5. Member updates the same branch and pushes again.
6. After approval, PR is merged into `dev`.
7. Everyone pulls latest `dev` before starting new work or updating existing work.

---

## 13. Main Branch Rule

Only stable code should go into `main`.

Use this flow:

```txt
feature branch → dev → tested → main
```

Before merging `dev` into `main`, test the full MVP flow:

```txt
Owner signup/login
Owner submits venue
Admin approves venue
User sees approved venue
User sends booking inquiry
Owner accepts/rejects inquiry
```

---

## 14. Common Mistakes to Avoid

Do not create a feature branch without first updating `dev`.

Do not commit:

```txt
node_modules
.env
```
Add them in .gitignore

Do not edit another member's files unless discussed.

Do not delete or restructure shared folders without team approval.

Do not keep working for many days without pulling latest `dev`.

Do not open huge PRs with unrelated changes.
