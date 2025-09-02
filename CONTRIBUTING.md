# Contributing Guidelines

Welcome to the project! 🎉  
This document explains how we work together. Please read it carefully before contributing.

---

## 📌 Branching Strategy

- **`main`** is our protected branch. No one pushes directly to `main`.
- All work must be done on **feature branches**:
  - `<your-name>/feature/<feature-name>` → new features (e.g., `neo/feature/login-page`)
  - `<your-name>/bugfix/<bug-name>` → bug fixes (e.g., `neo/bugfix/cart-total`)
  - `<your-name>/hotfix/<hotfix-name>` → urgent fixes to `main` (e.g., `neo/hotfix/payment-error`)

---

## 🔄 Workflow

```mermaid
flowchart TD
    A[Start from main] --> B[Create a new branch]
    B --> C[Make changes locally]
    C --> D[Commit changes]
    D --> E[Push branch to GitHub]
    E --> F[Open Pull Request into main]
    F --> G[Request review]
    G --> H[Address feedback]
    H --> I[Approval + checks pass]
    I --> J[Merge into main 🎉]
```
