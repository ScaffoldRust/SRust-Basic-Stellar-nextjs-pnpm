# SCAFFOLD-STELLAR-PNPM

## Description
This is a monorepo project structured with **pnpm** and **Next.js**, organized within the `packages` folder.

---

## Prerequisites
- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher)

If you do not have `pnpm` installed, install it globally using:

```bash
npm install -g pnpm

Installation
    Clone the repository:
    git clone <REPOSITORY_URL>
    cd SCAFFOLD-STELLAR-PNPM

Install dependencies:
    pnpm install
    Running the Project


To start the development server for Next.js:
    pnpm dev -F nextjs
    The application will be running at http://localhost:3000.

Project Structure
SCAFFOLD-STELLAR-PNPM
│   README.md
│   package.json
│   pnpm-workspace.yaml
│   .gitignore
└───packages
    └───nextjs
        │   package.json
        │   tsconfig.json
        │   next.config.js
        └───src
            └───app
                └───page.tsx
packages/nextjs: Contains the Next.js application.
pnpm-workspace.yaml: Configuration for the monorepo.
.gitignore: Files and directories ignored by Git.
Useful Commands
    Start Development Server
        pnpm dev -F nextjs

Build for Production
    pnpm build -F nextjs

Run in Production Mode
    pnpm start -F nextjs
