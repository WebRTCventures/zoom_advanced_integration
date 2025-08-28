# Zoom Integration Web Client with OKTA/Auth0

React-based web application for embedded Zoom meetings with enterprise SSO via OKTA/Auth0 authentication and Meeting SDK integration.

## Overview

This is the frontend client for the Zoom Advanced Integration project. It provides a user interface for joining Zoom meetings directly in the browser using the Zoom Meeting SDK, with enterprise-grade authentication via OKTA/Auth0 that enforces group-based permissions.

## Features

- 🔐 **OKTA/Auth0 SSO Integration** - Enterprise single sign-on
- 👥 **Group-Based Authorization** - OKTA groups determine Zoom permissions
- 🎥 **Embedded Zoom Meetings** - No app download required
- 🏢 **Organization Context** - Meetings filtered by user's organization
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚡ **Fast Development** - Vite with HMR
- 🎨 **TypeScript** - Full type safety
- 🔄 **React Router** - Client-side navigation
- 📊 **User Profile Display** - Shows OKTA user info and groups

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Authentication**: Auth0 React SDK (with OKTA enterprise connection)
- **Zoom Integration**: Zoom Meeting SDK / Web SDK
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Token Management**: JWT with OKTA claims

## Prerequisites

- Node.js v18+
- Backend server running (see `/server` directory)
- Auth0 Application configured (with optional OKTA enterprise connection)
- OKTA tenant (for enterprise SSO)
- Zoom Meeting SDK app credentials (server-side only)

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the web directory:

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-audience
VITE_API_BASE=http://localhost:4000

# Optional: Direct OKTA Integration
VITE_OKTA_ISSUER=https://your-company.okta.com/oauth2/default
VITE_OKTA_CLIENT_ID=okta-spa-client-id
VITE_OKTA_REDIRECT_URI=http://localhost:5173/callback
```

### OKTA Configuration (Enterprise SSO)

1. **Create OKTA Application**:

   - Application Type: Single Page App (SPA)
   - Grant Type: Authorization Code with PKCE
   - Sign-in redirect URIs:
     - `http://localhost:5173/callback`
     - `https://your-app.com/callback`
   - Sign-out redirect URIs:
     - `http://localhost:5173`
     - `https://your-app.com`

2. **Configure Groups & Claims**:

   - Add Groups claim to ID token
   - Include user profile attributes
   - Map department and organization fields

3. **Assign Users & Groups**:
   - Assign application to relevant OKTA groups
   - Configure group-based access policies

### Auth0 Setup (with OKTA Integration)

1. **Create Single Page Application (SPA)**:

   - Application Type: Single Page Application
   - Allowed Callback URLs:
     - `http://localhost:5173/callback`
     - `https://your-app.com/callback`
   - Allowed Logout URLs:
     - `http://localhost:5173`
     - `https://your-app.com`
   - Allowed Web Origins:
     - `http://localhost:5173`
     - `https://your-app.com`

2. **Configure OKTA Enterprise Connection** (optional):

   - Go to Authentication → Enterprise
   - Add OKTA SAML or OpenID Connect connection
   - Configure attribute mappings:
     ```json
     {
       "email": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
       "name": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
       "groups": "http://schemas.xmlsoap.org/claims/Group",
       "department": "department",
       "organization": "organization"
     }
     ```

3. **Enable Connection for Application**:
   - Go to Applications → Your SPA
   - Enable the OKTA enterprise connection
   - Configure login flow to use OKTA by default

## Commands

```bash
# Start development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
web/
├── src/
│   ├── pages/
│   │   ├── Home.tsx           # Main landing page
│   │   └── ZoomContainer.tsx  # Embedded Zoom meeting component
│   ├── zoom/
│   │   └── join.ts            # Zoom SDK integration utilities
│   ├── assets/                # Static assets
│   ├── auth0.tsx              # Auth0 provider configuration
│   ├── App.tsx                # Main app component with routing
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles
├── public/                    # Public static files
├── dist/                      # Production build (generated)
├── package.json
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── .env                      # Environment variables (create this)
```

## Key Components

### Auth0 Provider with OKTA Integration (`auth0.tsx`)

Wraps the application with Auth0/OKTA authentication context, providing:

- **SSO Login/Logout** - Seamless OKTA authentication
- **User Profile Access** - Including OKTA groups and organization
- **Token Management** - JWT tokens with OKTA claims
- **Group-Based Permissions** - Automatic role assignment from OKTA groups

Example implementation:

```typescript
const Auth0ProviderWithConfig = ({ children }) => {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: "openid profile email offline_access",
        // Optional: Force OKTA connection
        connection: "okta-enterprise",
      }}
    >
      {children}
    </Auth0Provider>
  );
};
```

### ZoomContainer (`pages/ZoomContainer.tsx`)

Handles Zoom Meeting SDK integration with OKTA-based permissions:

- Initializes Zoom SDK
- Joins meetings with server-validated signatures
- Role determined by OKTA groups
- Manages meeting lifecycle

### Home Page with OKTA Context (`pages/Home.tsx`)

Main landing page enhanced with OKTA information:

- **Authentication Status** - Shows OKTA SSO state
- **User Profile Display** - Name, email, organization, department
- **Group Membership** - Displays user's OKTA groups
- **Meeting Interface** - Join/host based on OKTA permissions
- **Permission-Based UI** - Shows/hides features based on groups

## API Integration with OKTA Claims

The web client communicates with the backend server, passing OKTA-enriched tokens:

### SDK Signature Generation with OKTA Validation

```javascript
// POST /api/sdk-signature - Role validated against OKTA groups
const getSignature = async (meetingNumber: string) => {
  const token = await getAccessTokenSilently();

  // Decode to check OKTA groups client-side (optional)
  const claims = jwt_decode(token);
  const isHost = claims.groups?.includes("zoom-hosts");

  const response = await fetch(`${API_BASE}/api/sdk-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      meetingNumber,
      role: isHost ? 1 : 0, // Server will validate this
    }),
  });

  return response.json();
};
```

### Meeting Management with Organization Context

```javascript
// POST /api/meetings - Creates meeting with OKTA organization context
const createMeeting = async (topic: string, duration: number) => {
  const token = await getAccessTokenSilently();

  const response = await fetch(`${API_BASE}/api/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Contains OKTA claims
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      duration,
      type: 2, // Scheduled meeting
    }),
  });

  // Server enforces organization/department restrictions
  return response.json();
};
```

## OKTA/Auth0 Authentication Flow

1. **User Clicks "Login with SSO"**
   - Redirected to Auth0
   - Auth0 redirects to OKTA (if enterprise connection configured)
2. **OKTA Authentication**
   - User enters OKTA credentials
   - MFA challenge (if configured)
   - OKTA validates against Active Directory/LDAP
3. **Token Generation**
   - OKTA returns SAML assertion or OIDC tokens
   - Auth0 enriches token with OKTA claims (groups, department, org)
   - JWT includes user's OKTA groups for authorization
4. **Return to Application**
   - Redirected back with tokens
   - Tokens stored securely in Auth0 React SDK
   - User profile includes OKTA attributes
5. **API Calls with OKTA Context**
   - All API calls include JWT with OKTA claims
   - Backend validates token and extracts OKTA groups
   - Permissions enforced based on OKTA group membership

## Zoom Meeting Integration

### Joining a Meeting

1. User enters meeting ID and password
2. Client requests SDK signature from backend
3. Backend generates signature using SDK credentials
4. Client initializes Zoom SDK with signature
5. User joins meeting in embedded view

### Meeting Configuration

```javascript
ZoomMtg.init({
  leaveUrl: "http://localhost:5173",
  patchJsMedia: true,
  leaveOnPageUnload: true,
  success: () => {
    ZoomMtg.join({
      signature: signature,
      meetingNumber: meetingNumber,
      passWord: passWord,
      userName: userName,
      userEmail: userEmail,
    });
  },
});
```

## Development

### Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the client:

```javascript
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
```

### Hot Module Replacement (HMR)

Vite provides instant updates during development:

```bash
npm run dev
# Changes are reflected immediately in the browser
```

### Type Checking

TypeScript provides compile-time type checking:

```bash
# Check types without building
npx tsc --noEmit
```

### ESLint Configuration

The project includes ESLint for code quality. To expand the configuration for production:

```javascript
// eslint.config.js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      // For stricter rules:
      ...tseslint.configs.strictTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build locally
npm run preview
```

The production build will be in the `dist/` directory.

### Deployment Checklist

- [ ] Update environment variables for production
- [ ] Configure Auth0 production URLs
- [ ] Set up HTTPS (required for camera/microphone access)
- [ ] Configure CDN for static assets
- [ ] Set up monitoring and error tracking

## Troubleshooting

### Common Issues

**Auth0 Callback Error**

- Verify callback URL is configured in Auth0 dashboard
- Check `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID`

**Zoom SDK Not Loading**

- Ensure SDK files are accessible
- Check browser console for CORS errors
- Verify signature generation endpoint is working

**API Connection Failed**

- Verify backend server is running
- Check `VITE_API_BASE` environment variable
- Ensure Auth0 audience matches backend configuration

**Camera/Microphone Not Working**

- HTTPS is required for media access in production
- Check browser permissions
- Verify Zoom SDK initialization

### Debug Mode

Enable debug logging in the browser console:

```javascript
// In development
localStorage.setItem("debug", "*");
```

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

Note: The Zoom Meeting SDK has specific browser requirements. Check [Zoom Browser Support](https://developers.zoom.us/docs/meeting-sdk/web/browser-support/) for details.

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Keep SDK credentials on the server only
3. **HTTPS**: Required for production (camera/mic access)
4. **Content Security Policy**: Configure CSP headers
5. **Token Storage**: Handled securely by Auth0 SDK

## Performance Optimization

- Lazy loading for Zoom SDK components
- Code splitting with React.lazy()
- Vite's automatic chunk optimization
- Tree shaking for unused code

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Auth0 React SDK](https://auth0.com/docs/libraries/auth0-react)
- [Zoom Meeting SDK](https://developers.zoom.us/docs/meeting-sdk/web/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
