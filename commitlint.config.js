export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Type must be one of the following
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation only changes
        "style", // Changes that don't affect the meaning of code (formatting, etc.)
        "refactor", // Code change that neither fixes a bug nor adds a feature
        "perf", // Performance improvement
        "test", // Adding or updating tests
        "build", // Changes to build system or dependencies
        "ci", // Changes to CI configuration
        "chore", // Other changes that don't modify src or test files
        "revert", // Reverts a previous commit
      ],
    ],

    // Type must be lowercase
    "type-case": [2, "always", "lower-case"],

    // Type cannot be empty
    "type-empty": [2, "never"],

    // Subject (description) cannot be empty
    "subject-empty": [2, "never"],

    // Subject must be lowercase
    "subject-case": [2, "always", "lower-case"],

    // Subject must not end with period
    "subject-full-stop": [2, "never", "."],

    // Header (type + scope + subject) max length
    "header-max-length": [2, "always", 100],

    // Body max line length
    "body-max-line-length": [2, "always", 200],

    // Footer max line length
    "footer-max-line-length": [2, "always", 200],

    // Scope is optional but if provided, must be lowercase
    "scope-case": [2, "always", "lower-case"],
  },
  prompt: {
    questions: {
      type: {
        description: "Select the type of change you're committing",
        enum: {
          feat: {
            description: "A new feature",
            title: "Features",
          },
          fix: {
            description: "A bug fix",
            title: "Bug Fixes",
          },
          docs: {
            description: "Documentation only changes",
            title: "Documentation",
          },
          style: {
            description: "Changes that don't affect the meaning of code",
            title: "Styles",
          },
          refactor: {
            description: "A code change that neither fixes a bug nor adds a feature",
            title: "Code Refactoring",
          },
          perf: {
            description: "A code change that improves performance",
            title: "Performance Improvements",
          },
          test: {
            description: "Adding or updating tests",
            title: "Tests",
          },
          build: {
            description: "Changes to build system or external dependencies",
            title: "Builds",
          },
          ci: {
            description: "Changes to CI configuration files and scripts",
            title: "Continuous Integration",
          },
          chore: {
            description: "Other changes that don't modify src or test files",
            title: "Chores",
          },
          revert: {
            description: "Reverts a previous commit",
            title: "Reverts",
          },
        },
      },
      scope: {
        description: "What is the scope of this change (e.g., backend, frontend, auth, booking)",
      },
      subject: {
        description: "Write a short, imperative tense description of the change",
      },
      body: {
        description: "Provide a longer description of the change (optional)",
      },
      isBreaking: {
        description: "Are there any breaking changes?",
      },
      breakingBody: {
        description:
          "A breaking change commit requires a body. Please provide a longer description",
      },
      breaking: {
        description: "Describe the breaking changes",
      },
      isIssueAffected: {
        description: "Does this change affect any open issues?",
      },
      issuesBody: {
        description:
          "If issues are closed, the commit requires a body. Please provide a longer description",
      },
      issues: {
        description: 'Add issue references (e.g., "fix #123", "re #123")',
      },
    },
  },
};
