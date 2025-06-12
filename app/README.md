# Colbee API

This is the consolidated API for the Colbee project. All project management functionality is now available through a single API endpoint.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017/colbee
PORT=3001
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Projects

- **GET /api/projects** - Get all projects
- **POST /api/projects** - Create a new project
- **PUT /api/projects/:id** - Update a project
- **DELETE /api/projects/:id** - Delete a project
- **PATCH /api/projects/:id/favorite** - Toggle project favorite status

## Project Structure

- `server.js` - Main entry point with all API routes
- `package.json` - Project dependencies and scripts 