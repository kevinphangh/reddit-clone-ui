# VIA Pædagoger Backend

Backend API for VIA Pædagoger forum.

## Getting Started

Backend implementation coming soon.

## Planned Tech Stack

- **Runtime**: Node.js or Python
- **Framework**: TBD (Express.js, FastAPI, etc.)
- **Database**: PostgreSQL or MongoDB
- **Authentication**: JWT
- **API**: RESTful or GraphQL

## API Endpoints (Planned)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/vote` - Vote on post

### Comments
- `GET /api/posts/:postId/comments` - Get comments for post
- `POST /api/posts/:postId/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/vote` - Vote on comment

### Users
- `GET /api/users/:username` - Get user profile
- `GET /api/users/:username/posts` - Get user's posts
- `GET /api/users/:username/comments` - Get user's comments

## Development

Coming soon...