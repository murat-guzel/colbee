# Colbee Project

## API Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017
PORT=3001
```

3. Start the API server:
```bash
node src/api/server.js
```

The API will be available at http://localhost:3001

## Available Endpoints

### GET /api/projects
Returns the list of projects from the MongoDB database.

Example response:
```json
[
  {
    "_id": "684aa5bde5a3242417fa4862",
    "ProjectName": "New AEPO"
  },
  {
    "_id": "684aa5d7e5a3242417fa4863",
    "ProjectName": "Old PRE"
  }
]
``` 