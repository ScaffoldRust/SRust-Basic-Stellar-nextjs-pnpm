# SCAFFOLD-STELLAR-PNPM

This is a monorepo project structured with pnpm and Next.js, organized within the `packages` folder.

---

## Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher)

If you do not have pnpm installed, install it globally using:

```bash
npm install -g pnpm
```

## Installation

## Clone the repository:

```bash
git clone <REPOSITORY_URL>
cd SCAFFOLD-STELLAR-PNPM
```
## Install dependencies:

```bash
pnpm install
```
## Running the Project

To start the development server for Next.js, use:

```bash
pnpm dev -F nextjs
```
The application will be running at:

- **Local:** [http://localhost:3000](http://localhost:3000)
- **Network:** [http://192.168.100.6:3000](http://192.168.100.6:3000)

## Project Structure

```plaintext
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

- **packages/nextjs**: Contains the Next.js application.
- **pnpm-workspace.yaml**: Configuration for the monorepo.
- **.gitignore**: Files and directories ignored by Git.
```
## Useful Commands

## Start Development Server

```bash
pnpm dev -F nextjs
```
##Build for Production

```bash
pnpm build -F nextjs
```
## Run in Production Mode

```bash
pnpm start -F nextjs
```
## Navigation

To navigate to the Next.js package and run the development server directly:

```bash
cd packages/nextjs
pnpm run dev
```
The application will be accessible at:

- **Local:** [http://localhost:3000](http://localhost:3000)
- **Network:** [http://192.168.100.6:3000](http://192.168.100.6:3000)
