# Authenticator Platform

A complete production-style authentication platform inspired by Clerk/Auth0.

## Structure
- \`backend\`: Express server (Node.js) + MongoDB Atlas
- \`dashboard\`: Vite + React app for developers to manage their applications
- \`sdk\`: Vanilla JS Core SDK & Web Components (\`authenticator-sdk\`)
- \`react-sdk\`: React wrapper & Hooks (\`authenticator-react\`)
- \`demo-app\`: A demo React application using the SDK

## Features
- **Multi-Tenant**: Developers can create multiple applications.
- **Prebuilt UI Components**: Clerk-like components (\`<AuthSignIn />\`, \`<AuthSignUp />\`, \`<UserButton />\`).
- **Session Management**: JWT access tokens and long-lived refresh tokens.
- **Security**: Secure route protection (\`<ProtectedRoute>\`), password hashing via bcrypt.

## Getting Started Locally

1. **Install Dependencies**
   Run the following from the root directory:
   \`\`\`bash
   npm install --legacy-peer-deps
   \`\`\`

2. **Start Backend**
   Provide a \`MONGODB_URI\` in \`backend/.env\` or ensure local MongoDB is running.
   \`\`\`bash
   cd backend
   npm run dev
   \`\`\`

3. **Start Dashboard**
   \`\`\`bash
   cd dashboard
   npm run dev
   \`\`\`

4. **Create an App & Test Demo**
   - Go to the Dashboard (http://localhost:5173).
   - Sign up as a Developer.
   - Create an application and copy the \`Client ID\`.
   - Paste the \`Client ID\` into \`demo-app/src/App.jsx\`.
   - Start the demo app:
     \`\`\`bash
     cd demo-app
     npm run dev
     \`\`\`

## Deployment

- **Backend**: Configured for Render via \`render.yaml\`.
- **Dashboard & Demo App**: Can be deployed to Vercel via \`vercel.json\` or standard Vercel GitHub integration.
