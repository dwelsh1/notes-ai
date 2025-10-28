# NotesAI API Documentation

OpenAPI specification for the NotesAI backend API.

## Base URL

```
http://localhost:4000/api
```

## CORS Configuration

All endpoints support CORS for cross-origin requests from the Vite frontend:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,OPTIONS,PATCH,DELETE,POST,PUT
```

## Pages API

### GET /api/pages

Retrieve all pages with their relationships.

**Request:**
```
GET /api/pages
```

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "content": "string",
    "parentId": "string | null",
    "order": "number",
    "isFavorite": "boolean",
    "createdAt": "Date",
    "updatedAt": "Date",
    "tags": "string[]",
    "images": [
      {
        "id": "string",
        "filename": "string",
        "originalName": "string",
        "mimeType": "string",
        "size": "number",
        "createdAt": "Date"
      }
    ],
    "children": [
      {
        "id": "string",
        "title": "string",
        // ... nested children
      }
    ]
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Internal server error

---

### POST /api/pages

Create a new page.

**Request:**
```json
{
  "title": "string",
  "content": "string",
  "parentId": "string | null",
  "order": "number",
  "isFavorite": "boolean",
  "tags": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "parentId": "string | null",
  "order": "number",
  "isFavorite": "boolean",
  "tags": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Status Codes:**
- `201` - Created
- `500` - Internal server error

---

## Image API

### GET /api/images

Retrieve all images.

**Request:**
```
GET /api/images
```

**Response:**
```json
[
  {
    "id": "string",
    "filename": "string",
    "originalName": "string",
    "mimeType": "string",
    "size": "number",
    "pageId": "string",
    "createdAt": "Date"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Internal server error

---

### POST /api/images

Upload a new image.

**Request:**
```json
{
  "filename": "string",
  "originalName": "string",
  "mimeType": "string",
  "size": "number",
  "pageId": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "filename": "string",
  "originalName": "string",
  "mimeType": "string",
  "size": "number",
  "pageId": "string",
  "createdAt": "Date"
}
```

**Status Codes:**
- `201` - Created
- `500` - Internal server error

---

## Settings API

### GET /api/settings

Retrieve application settings.

**Request:**
```
GET /api/settings
```

**Response:**
```json
{
  "id": "string",
  "aiEngine": "string",
  "lmStudioUrl": "string",
  "lmStudioModel": "string | null",
  "preferredModel": "string | null",
  "fallbackEnabled": "boolean",
  "updatedAt": "Date"
}
```

**Status Codes:**
- `200` - Success
- `404` - Settings not found
- `500` - Internal server error

---

### PUT /api/settings

Update application settings.

**Request:**
```json
{
  "aiEngine": "string",
  "lmStudioUrl": "string",
  "lmStudioModel": "string | null",
  "preferredModel": "string | null",
  "fallbackEnabled": "boolean"
}
```

**Response:**
```json
{
  "id": "string",
  "aiEngine": "string",
  "lmStudioUrl": "string",
  "lmStudioModel": "string | null",
  "preferredModel": "string | null",
  "fallbackEnabled": "boolean",
  "updatedAt": "Date"
}
```

**Status Codes:**
- `200` - Success
- `404` - Settings not found
- `500` - Internal server error

---

## Individual Page API

### GET /api/pages/[id]

Retrieve a single page by ID.

**Request:**
```
GET /api/pages/[id]
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "parentId": "string | null",
  "order": "number",
  "isFavorite": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date",
  "tags": "string[]",
  "images": [],
  "children": []
}
```

**Status Codes:**
- `200` - Success
- `404` - Page not found
- `500` - Internal server error

---

### PUT /api/pages/[id]

Update a single page by ID.

**Request:**
```json
{
  "title": "string",
  "content": "string",
  "parentId": "string | null",
  "order": "number",
  "isFavorite": "boolean",
  "tags": "string[]"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "parentId": "string | null",
  "order": "number",
  "isFavorite": "boolean",
  "tags": "string[]",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Status Codes:**
- `200` - Success
- `404` - Page not found
- `500` - Internal server error

---

### DELETE /api/pages/[id]

Delete a single page by ID.

**Request:**
```
DELETE /api/pages/[id]
```

**Response:**
```json
No content (204)
```

**Status Codes:**
- `204` - Success (No Content)
- `404` - Page not found
- `500` - Internal server error

---

## Usage Examples

### Frontend Integration (Vite)

```typescript
// Create a new page
const createPage = async (title: string) => {
  const response = await fetch('http://localhost:4000/api/pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      content: JSON.stringify(editor.document),
      order: 0,
      isFavorite: false,
      tags: '[]',
    }),
  });
  return response.json();
};

// Load a page
const loadPage = async (pageId: string) => {
  const response = await fetch(`http://localhost:4000/api/pages/${pageId}`);
  return response.json();
};

// Save current page
const savePage = async (pageId: string, content: string) => {
  await fetch(`http://localhost:4000/api/pages/${pageId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
};
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "string"
}
```

