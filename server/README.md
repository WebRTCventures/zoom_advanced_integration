# Zoom Integration Server

Express.js backend service for Zoom integration with Auth0 authentication, Server-to-Server OAuth, and webhook handling.

## Overview

This server provides secure API endpoints for Zoom meeting management, SDK signature generation, and webhook processing. It uses Auth0 for JWT-based authentication and implements Zoom's Server-to-Server OAuth for API access.

## Features

- 🔐 JWT authentication via Auth0
- 🔑 Server-to-Server OAuth for Zoom API
- 📝 Meeting SDK signature generation
- 🪝 Webhook validation and processing
- 🎥 Full CRUD operations for meetings
- ⚡ TypeScript with hot reload

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: Auth0 (express-oauth2-jwt-bearer)
- **Zoom Integration**: Server-to-Server OAuth, Meeting SDK
- **Development**: tsx (TypeScript Execute)

## Prerequisites

- Node.js v18+
- Zoom Developer Account with:
  - Server-to-Server OAuth app
  - Meeting SDK app
- Auth0 Account with API configured

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=4000

# Zoom S2S OAuth (internal app)
ZOOM_ACCOUNT_ID=your_account_id
ZOOM_CLIENT_ID=your_client_id
ZOOM_CLIENT_SECRET=your_client_secret

# Zoom Meeting SDK (Web)
ZOOM_SDK_KEY=your_sdk_key
ZOOM_SDK_SECRET=your_sdk_secret

# Zoom Webhooks
ZOOM_WEBHOOK_SECRET_TOKEN=your_webhook_secret_token

# Auth0
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-api-identifier
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
```

## Commands

```bash
# Development with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start
```

## Project Structure

```
server/
├── src/
│   ├── auth/
│   │   └── auth0.ts         # Auth0 JWT middleware
│   ├── zoom/
│   │   ├── meetings.ts      # Meeting CRUD operations
│   │   ├── s2s.ts          # Server-to-Server OAuth
│   │   ├── sdkSig.ts       # SDK signature generation
│   │   └── webhook.ts      # Webhook handling
│   └── index.ts            # Main server file
├── dist/                   # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── .env                    # Environment variables (create this)
```

## API Documentation

### Base URL

```
http://localhost:4000
```

### Authentication

Protected endpoints require an Auth0 JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Health Check

```http
GET /health
```

Returns: `"ok"`

#### Meeting SDK Signature (Protected)

```http
GET /api/sdk-signature
```

Query Parameters:

- `meetingNumber`: Meeting ID
- `role`: User role (0 = participant, 1 = host)

Response:

```json
{
  "signature": "generated-signature"
}
```

#### List Meetings

```http
GET /api/meetings
```

Query Parameters:

- `page_size`: Number of results (default: 30)
- `next_page_token`: Pagination token

Response:

```json
{
  "meetings": [...],
  "next_page_token": "..."
}
```

#### Create Meeting

```http
POST /api/meetings
```

Body:

```json
{
  "topic": "Meeting Title",
  "type": 2,
  "start_time": "2024-01-01T10:00:00Z",
  "duration": 60,
  "settings": {
    "host_video": true,
    "participant_video": true
  }
}
```

#### Update Meeting

```http
PUT /api/meetings/:meetingId
```

Body: Same as create meeting

#### Delete Meeting

```http
DELETE /api/meetings/:meetingId
```

#### Webhook Endpoint

```http
POST /zoom/webhook
```

Receives and validates Zoom webhook events

## Zoom Integration Details

### Server-to-Server OAuth

The server automatically manages OAuth tokens for Zoom API access:

- Tokens are requested and cached
- Automatic refresh before expiration
- Used for all meeting management operations

### Meeting SDK Signatures

Signatures are generated server-side for secure client authentication:

- Uses SDK key and secret
- Includes meeting number and user role
- JWT-based signature with expiration

### Webhook Validation

Incoming webhooks are validated using:

- Secret token verification
- HMAC signature validation
- Raw body parsing for integrity

## Error Handling

The server implements standard HTTP status codes:

- `200` - Success
- `401` - Unauthorized (missing/invalid JWT)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Internal server error

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **JWT Validation**: All protected routes validate Auth0 tokens
3. **CORS**: Configure for production domains only
4. **Webhook Security**: Validate all webhook signatures
5. **Token Storage**: S2S tokens stored in memory only
6. **HTTPS**: Use HTTPS in production

## Development Tips

### Hot Reload

The dev server uses `tsx` for automatic reloading on file changes:

```bash
npm run dev
```

### TypeScript Compilation

Check TypeScript errors without running:

```bash
npx tsc --noEmit
```

### Testing API Endpoints

Use tools like curl, Postman, or HTTPie:

```bash
# Health check
curl http://localhost:4000/health

# Get meetings (requires Auth0 token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/api/meetings
```

## Deployment Considerations

1. Set `NODE_ENV=production`
2. Use a process manager (PM2, systemd)
3. Configure reverse proxy (nginx, Apache)
4. Set up SSL/TLS certificates
5. Monitor logs and metrics
6. Configure production CORS origins
7. Set up webhook URL in Zoom app

## Troubleshooting

### Common Issues

**Port Already in Use**

```bash
# Find process using port 4000
lsof -i :4000
# Kill the process
kill -9 <PID>
```

**Auth0 Token Errors**

- Verify Auth0 domain and audience match
- Check token expiration
- Ensure correct issuer URL

**Zoom API Errors**

- Verify S2S OAuth credentials
- Check account permissions
- Monitor API rate limits

**TypeScript Errors**

```bash
# Clear build cache
rm -rf dist
npm run build
```

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Zoom API Reference](https://marketplace.zoom.us/docs/api-reference)
- [Auth0 Node.js Guide](https://auth0.com/docs/quickstart/backend/nodejs)
- [TypeScript Documentation](https://www.typescriptlang.org/)
