SCAFFOLD-STELLAR-PNPM
Description
This is a monorepo project structured with pnpm and Next.js, organized within the packages folder.

Prerequisites
Node.js (v18 or higher)
pnpm (v8 or higher)
If you do not have pnpm installed, install it globally using:

nginx
Copy
Edit
npm install -g pnpm
Installation
Clone the repository:
git clone <REPOSITORY_URL>
cd SCAFFOLD-STELLAR-PNPM

Install dependencies:
pnpm install

Running the Project
To start the development server for Next.js, use:
pnpm dev -F nextjs

The application will be running at:

Local: http://localhost:3000
Network: http://192.168.100.6:3000
The server starts quickly, with an initialization time of approximately 1627ms.

Project Structure
lua
Copy
Edit
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
r
Copy
Edit
pnpm dev -F nextjs  
Build for Production
r
Copy
Edit
pnpm build -F nextjs  
Run in Production Mode
r
Copy
Edit
pnpm start -F nextjs  
Navigation
To navigate to the Next.js package and run the development server directly:

bash
Copy
Edit
cd packages/nextjs  
pnpm run dev  
The application will be accessible at:

Local: http://localhost:3000
Network: http://192.168.100.6:3000
