# Zoom Advanced Integration with OKTA/Auth0

A full-stack application demonstrating enterprise-grade Zoom integration with OKTA/Auth0 authentication, featuring Server-to-Server OAuth, Meeting SDK integration, group-based authorization, and webhook handling.

## Overview

This project implements a secure, scalable Zoom integration platform with enterprise Single Sign-On (SSO) capabilities through OKTA/Auth0. It consists of two main components:

- **Server**: Express.js backend with TypeScript for Zoom API integration and OKTA/Auth0 JWT validation
- **Web**: React frontend with Vite for embedded Zoom meetings and OKTA/Auth0 authentication

## Features

- 🔐 **Enterprise SSO** via OKTA/Auth0 with MFA support
- 👥 **Group-Based Authorization** - OKTA groups determine Zoom permissions
- 🎥 **Embedded Zoom Meetings** using Meeting SDK
- 🔄 **Server-to-Server OAuth** for secure Zoom API access
- 🪝 **Webhook Integration** for real-time Zoom events
- 📊 **Meeting Management** (Create, Read, Update, Delete)
- 🔒 **JWT-protected endpoints** with OKTA claims validation
- 🏢 **Organization-Based Access Control** - Department and org-level restrictions
- 📝 **Comprehensive Audit Logging** with OKTA context

## Tech Stack

### Backend

- Node.js + Express
- TypeScript
- Auth0/OKTA (JWT authentication with enterprise SSO)
- Zoom Server-to-Server OAuth
- Zoom Meeting SDK
- express-oauth2-jwt-bearer (JWT validation)

### Frontend

- React 19
- TypeScript
- Vite
- Auth0 React SDK (with OKTA integration)
- Zoom Meeting SDK/Web SDK
- React Router

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Zoom Developer Account
- Auth0 Account (can be configured with OKTA as identity provider)
- OKTA Account (optional, for enterprise SSO)

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd zoom_advanced_integration
   ```

2. **Set up environment variables**

   Create `.env` files in both `/server` and `/web` directories based on the `.env.example` templates:

   **Server** (`/server/.env`):

   ```env
   # Auth0/OKTA Configuration
   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_AUDIENCE=your-api-identifier
   AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com

   # OKTA Enterprise Connection (if using OKTA directly)
   OKTA_DOMAIN=your-company.okta.com
   OKTA_CLIENT_ID=okta-client-id
   OKTA_CLIENT_SECRET=okta-client-secret

   # Zoom S2S OAuth (internal app)
   ZOOM_ACCOUNT_ID=your_account_id
   ZOOM_CLIENT_ID=your_client_id
   ZOOM_CLIENT_SECRET=your_client_secret

   # Zoom Meeting SDK (Web)
   ZOOM_SDK_KEY=your_sdk_key
   ZOOM_SDK_SECRET=your_sdk_secret

   # Zoom Webhooks
   ZOOM_WEBHOOK_SECRET_TOKEN=your_webhook_secret_token
   ```

   **Web** (`/web/.env`):

   ```env
   VITE_AUTH0_DOMAIN=your-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   VITE_AUTH0_AUDIENCE=your-audience
   VITE_API_BASE=http://localhost:4000

   # Optional: OKTA-specific settings if using OKTA directly
   VITE_OKTA_DOMAIN=your-company.okta.com
   VITE_OKTA_CLIENT_ID=okta-spa-client-id
   ```

3. **Install dependencies**

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install web dependencies
   cd ../web
   npm install
   ```

4. **Run the applications**

   In separate terminals:

   ```bash
   # Terminal 1: Start the server (port 4000)
   cd server
   npm run dev

   # Terminal 2: Start the web app (port 5173)
   cd web
   npm run dev
   ```

5. **Access the application**

   Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
zoom_advanced_integration/
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── auth/          # Authentication middleware
│   │   ├── zoom/          # Zoom integration modules
│   │   └── index.ts       # Main server file
│   └── package.json
├── web/                   # Frontend React application
│   ├── src/
│   │   ├── pages/         # React pages/routes
│   │   ├── zoom/          # Zoom SDK integration
│   │   ├── auth0.tsx      # Auth0 configuration
│   │   └── App.tsx        # Main app component
│   └── package.json
└── CLAUDE.md              # Claude Code assistance guide
```

## API Endpoints

### Public Endpoints

- `GET /health` - Health check
- `GET /api/docs` - API documentation

### Protected Endpoints (Auth0/OKTA JWT required)

- `POST /api/sdk-signature` - Generate Meeting SDK signature (validates OKTA groups for role)

### Meeting Management (Auth0/OKTA JWT required)

- `GET /api/meetings` - List meetings (filtered by organization)
- `POST /api/meetings` - Create a meeting
- `PUT /api/meetings/:meetingId` - Update a meeting (requires ownership/admin)
- `DELETE /api/meetings/:meetingId` - Delete a meeting (requires ownership/admin)

### Host-Only Endpoints (Requires OKTA host group)

- `POST /api/meetings/:meetingId/end` - End an active meeting
- `POST /api/meetings/:meetingId/recordings` - Manage recordings

### Webhook Endpoint

- `POST /zoom/webhook` - Receive Zoom webhook events (signature validated)

## Development

### Server Commands

```bash
cd server
npm run dev     # Run with hot reload (tsx)
npm run build   # Build TypeScript
npm start       # Run production build
```

### Web Commands

```bash
cd web
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## Configuration

### OKTA Setup (Enterprise SSO)

1. **Create OKTA Application**:

   - Type: Single Page Application (SPA)
   - Grant Type: Authorization Code with PKCE
   - Redirect URIs: `http://localhost:5173/callback`, `https://your-app.com/callback`

2. **Configure OKTA Groups**:

   - `zoom-hosts` - Users who can host meetings
   - `zoom-admins` - Full administrative access
   - `employees` - Standard meeting participants
   - `contractors` - Limited meeting access

3. **Set up OKTA API Token** (for group queries):
   - Navigate to Security → API → Tokens
   - Create token with appropriate scopes

### Auth0 Setup (with OKTA Integration)

1. **Create Applications**:

   - Single Page Application (SPA) for frontend
   - Machine-to-Machine API for backend

2. **Configure Enterprise Connection** (optional):

   - Add OKTA as SAML or OIDC connection
   - Map OKTA attributes to Auth0 claims
   - Configure group mappings

3. **Set Permissions**:
   - Configure allowed callback URLs
   - Set CORS origins
   - Enable refresh token rotation

### Zoom Setup

1. **Server-to-Server OAuth App**:

   - Scopes: `meeting:read`, `meeting:write` (minimum required)
   - Note Account ID, Client ID, and Client Secret

2. **Meeting SDK App**:

   - Note SDK Key and SDK Secret
   - Configure for production domain

3. **Webhook Configuration**:
   - Endpoint URL: `https://your-domain.com/zoom/webhook`
   - Events: meeting.started, meeting.ended, participant.joined, participant.left
   - Note Secret Token for validation

## Security Considerations

- **Credential Protection**: SDK secrets and OAuth credentials never leave the server
- **Authentication**: All API endpoints (except webhooks) require Auth0/OKTA JWT validation
- **Authorization**: OKTA groups determine user permissions and Zoom roles
- **Time-boxed Signatures**: Meeting SDK signatures expire after 2 hours
- **Webhook Security**: HMAC signature validation for all webhook requests
- **Organization Isolation**: Users can only access meetings within their organization
- **Audit Logging**: All actions logged with OKTA user context
- **CORS**: Restricted to specific origins in production

## Troubleshooting

### Common Issues

1. **OKTA Authentication Failures**:

   - Verify OKTA domain and client ID in Auth0 enterprise connection
   - Check user is assigned to the OKTA application
   - Ensure user's groups are properly mapped in token claims

2. **Permission Denied Errors**:

   - Verify user's OKTA groups in the JWT token
   - Check group-to-permission mappings in server configuration
   - Ensure Auth0 is passing group claims from OKTA

3. **CORS Errors**:

   - Ensure server CORS configuration matches your frontend URL
   - Add production domain to CORS whitelist

4. **Auth0 Token Issues**:

   - Verify domain, client ID, and audience match in both frontend and backend
   - Check token expiration and refresh token configuration
   - Ensure scopes are properly requested

5. **Zoom SDK Errors**:

   - Check SDK key/secret are correct and not exposed to client
   - Verify signature is generated server-side with proper role validation
   - Ensure meeting number and password are correct

6. **Meeting Access Issues**:
   - Verify user's organization matches meeting's organization
   - Check department-level restrictions if configured
   - Ensure user has appropriate OKTA group for requested action

## Support

For issues or questions, please open an issue in the repository.
