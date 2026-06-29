# 🤝 Contribution Guidelines

We are building BookMyVenue in **4 Phases** to ensure a structured and community-driven approach:

### 🚀 Phase 1: The MVP (Current Phase)
Our immediate goal is to explore different approaches to building the Minimum Viable Product (MVP).
- **Open Stack:** During this phase, **anyone can contribute a base MVP using any tech stack**. 
- You aren't just submitting a single feature or component—you are submitting the foundational base for the project! We encourage using a **Monorepo structure** (where your frontend and backend microservices are organized in folders within the single repository). It doesn't need to be perfect or fully featured, but it should cover the basic core flow end-to-end. We will review all submissions and merge the best one(s) to serve as our starting point.

### 🧩 Phase 2 & 3: Feature Implementation & Modularization
Once the MVP is solid, we will shift focus to expanding features and refining the architecture.
- Implementing features module by module.
- Refactoring and modularizing code to ensure it is clean, maintainable, and reusable.
- Standardizing the tech stack based on community consensus from Phase 1.

### 🌐 Phase 4: Fully Scalable Solution
The final phase focuses on scale and performance.
- Transitioning to a fully scalable product.
- Optimizing databases, adding caching layers, and handling high concurrent traffic.

## 🛠️ How to Contribute

We follow the standard open-source **Fork & Pull Request** workflow. Just follow these steps:

### Step 1: Fork and Clone the Repository
1. Click the **Fork** button at the top right of this page to create a copy of this repository in your GitHub account.
2. Clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/<your-username>/BookMyVenue.git
   cd BookMyVenue
   ```

### Step 2: Create a Branch
Always create a new branch for your work. Do not make changes directly on the `main` branch.
Give your branch a descriptive name so we know what you are working on.
```bash
git checkout -b feat/<branch-name>
```
*(Other prefixes you can use: `fix/`, `docs/`, `chore/`)*

### Step 3: Work and Commit
1. Make your code changes or additions.
2. Test your changes locally.
3. Commit your changes with a clear and concise commit message:
   ```bash
   git add .
   git commit -m "Add: <branch-name>"
   ```

### Step 4: Push and Create a Pull Request (PR)
1. Push your branch to your forked repository on GitHub:
   ```bash
   git push origin feat/<branch-name>
   ```
2. Go to the original BookMyVenue repository. You should see a prompt to **Compare & pull request**. Click it!
3. Provide a clear description in your PR of what you changed, why, and which phase it belongs to.
4. Submit the PR.

---

### Need Help?
If you're stuck or have questions about where to start, feel free to open an Issue and ask the community. We're here to help!

Happy Coding! 🎉
