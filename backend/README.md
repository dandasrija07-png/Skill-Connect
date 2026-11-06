# 🎓 SkillConnect Backend API & Database

Production-ready REST API and Real-Time WebSocket backend for the **SkillConnect** peer skill-exchange platform. Built with **Node.js**, **Express.js**, **MongoDB Atlas**, **Mongoose**, **JWT Authentication**, and **Socket.IO**.

---

## 🌟 Key Architecture & Features

- **Dual-Role User Architecture**: Every user can seamlessly teach skills, learn skills, and engage in mutual skill exchanges without separate accounts.
- **Mutual Match Algorithm**: Dynamically identifies 100% reciprocal matches where User A teaches what User B wants, and User B teaches what User A wants.
- **Real-Time Communication**: Socket.IO rooms for direct messaging, typing indicators, read receipts, and instantaneous notification dispatches.
- **Robust Security**: Helmet HTTP headers, CORS whitelisting, rate limiting on sensitive auth endpoints, bcrypt password hashing (10 salt rounds), and JWT bearer authentication.
- **Normalized API Responses**: Consistent `{ success, message, data, [pagination], [timestamp] }` response envelopes with typed `ApiError` handlers.
- **Graceful Cloud Fallback**: Cloudinary image uploads with automated local base64 fallback when cloud storage credentials are not provided.

---

## 📁 Backend Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB Atlas connection with timeout & auto-reconnect
│   │   ├── cloudinary.js        # Media storage setup with local fallback
│   │   └── socket.js            # Socket.IO authenticated server & room manager
│   ├── controllers/
│   │   ├── authController.js    # Register, login, me, logout, forgot/reset password
│   │   ├── userController.js    # Profiles, search, skills, statistics, image upload
│   │   ├── skillController.js   # Skill listings CRUD, filters, categories, status toggle
│   │   ├── requestController.js # Learning requests workflow (send, accept, reject)
│   │   ├── exchangeController.js# Mutual matching algorithm & exchange proposals
│   │   ├── sessionController.js # 1-on-1 sessions, scheduling, history, completion
│   │   ├── messageController.js # Direct messaging, unread counts, conversations
│   │   ├── notificationController.js # In-app notifications & read markers
│   │   ├── reviewController.js  # Ratings (1-5 stars), review feedback & responses
│   │   ├── wishlistController.js# Skill bookmarks and saved listings
│   │   ├── progressController.js# Learning milestones, custom goals, study hours
│   │   └── dashboardController.js# High-level aggregated statistics for teacher/learner
│   ├── models/
│   │   ├── User.js              # Comprehensive dual-role user schema
│   │   ├── Skill.js             # Skill listing with syllabus, outcomes, level, tags
│   │   ├── LearningRequest.js   # Direct mentorship request
│   │   ├── ExchangeRequest.js   # Bidirectional skill exchange proposal
│   │   ├── Session.js           # Live learning or exchange calendar session
│   │   ├── Conversation.js      # Message thread between two users
│   │   ├── Message.js           # Individual chat message with read receipts
│   │   ├── Notification.js      # Activity and system notification
│   │   ├── Review.js            # Star ratings, student comments, teacher response
│   │   ├── Wishlist.js          # Saved favorite skills
│   │   └── Progress.js          # Structured milestone tracker & study tracker
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── skillRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── exchangeRoutes.js
│   │   ├── sessionRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── progressRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # Protect routes with JWT verification
│   │   ├── errorMiddleware.js   # 404 handler and centralized error formatter
│   │   ├── uploadMiddleware.js  # Multer file parsing for images
│   │   └── validateMiddleware.js# Express-validator schema validation
│   ├── services/
│   │   ├── emailService.js      # Welcome and password reset mailer
│   │   └── notificationService.js# Real-time and persistent notification dispatcher
│   ├── utils/
│   │   ├── ApiResponse.js       # Standardized response envelopes
│   │   ├── ApiError.js          # Custom HTTP error classes
│   │   └── generateToken.js     # JWT token generation and verification
│   ├── scripts/
│   │   └── seed.js              # Database seeder with realistic test accounts & skills
│   ├── app.js                   # Express application setup
│   └── server.js                # Server entry point with HTTP and Socket.IO
├── .env.example                 # Template for required environment variables
├── .env                         # Environment settings (configured)
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ installed.
- **MongoDB Atlas** cluster URI or local MongoDB connection.

### 2. Environment Variables Configuration
In `backend/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/skillconnect?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=skillconnect_super_secret_jwt_key_2026_production_grade_token
JWT_EXPIRES_IN=7d

# Optional Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Seed the Database
Populate the database with 5 complete user profiles (including Priya Sharma, Alex Chen, Rohan Patel), skills, sessions, reviews, conversations, and progress milestones:
```bash
npm run seed
```

### 5. Start the Server
- **Development (with hot reload)**:
  ```bash
  npm run dev
  ```
- **Production**:
  ```bash
  npm start
  ```

Server will start on `http://localhost:5000`. Test health status at:
```
GET http://localhost:5000/api/health
```

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Sign in with email & password | No |
| `POST` | `/api/auth/logout` | Invalidate current session | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user data | Yes |
| `POST` | `/api/auth/forgot-password` | Request password reset email | No |
| `POST` | `/api/auth/reset-password` | Set new password with token | No |
| `PATCH` | `/api/auth/change-password`| Change existing password | Yes |

### Skills Marketplace (`/api/skills`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skills` | List skills (filter by search, category, level) | No |
| `GET` | `/api/skills/featured` | Fetch top-rated featured listings | No |
| `GET` | `/api/skills/categories`| List all skill categories with counts | No |
| `GET` | `/api/skills/my-skills` | Fetch logged-in user's skills | Yes |
| `GET` | `/api/skills/:id` | Get skill details by ID | No |
| `POST` | `/api/skills` | Publish a new skill listing | Yes |
| `PUT` | `/api/skills/:id` | Update an existing skill | Yes |
| `DELETE` | `/api/skills/:id` | Delete a skill listing | Yes |
| `PATCH` | `/api/skills/:id/status`| Toggle active/paused status | Yes |

### Skill Exchange Hub (`/api/exchanges`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/exchanges/matches`| Calculate reciprocal skill matches | Yes |
| `POST` | `/api/exchanges` | Create mutual exchange proposal | Yes |
| `GET` | `/api/exchanges` | Get all user exchanges (sent & received)| Yes |
| `PATCH` | `/api/exchanges/:id/accept`| Accept proposal | Yes |
| `PATCH` | `/api/exchanges/:id/reject`| Decline proposal | Yes |
| `PATCH` | `/api/exchanges/:id/cancel`| Cancel proposal | Yes |

### Learning Requests (`/api/requests`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/requests` | Request learning from a teacher | Yes |
| `GET` | `/api/requests/sent` | View requests sent by learner | Yes |
| `GET` | `/api/requests/received` | View requests received by teacher | Yes |
| `PATCH` | `/api/requests/:id/accept` | Accept request | Yes |
| `PATCH` | `/api/requests/:id/reject` | Reject request | Yes |

### Sessions & Meetings (`/api/sessions`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/sessions` | Schedule a new 1-on-1 session | Yes |
| `GET` | `/api/sessions` | Fetch all user sessions | Yes |
| `GET` | `/api/sessions/upcoming`| Fetch upcoming confirmed sessions | Yes |
| `GET` | `/api/sessions/history` | Fetch past completed sessions | Yes |
| `PUT` | `/api/sessions/:id` | Reschedule or edit session notes | Yes |
| `PATCH` | `/api/sessions/:id/complete`| Mark session as completed | Yes |
| `PATCH` | `/api/sessions/:id/cancel` | Cancel session | Yes |

### Direct Messaging (`/api/messages`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/messages/conversations` | List user conversation threads | Yes |
| `POST` | `/api/messages/conversations` | Start or get thread with user | Yes |
| `GET` | `/api/messages/conversations/:id` | Fetch paginated chat history | Yes |
| `POST` | `/api/messages` | Send message (triggers Socket.IO) | Yes |
| `PATCH` | `/api/messages/conversations/:id/read` | Mark thread as read | Yes |

### Ratings & Reviews (`/api/reviews`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reviews` | Submit star rating (1-5) & feedback | Yes |
| `GET` | `/api/reviews/teacher/:teacherId` | View teacher reviews & rating breakdown | No |
| `GET` | `/api/reviews/skill/:skillId` | View skill reviews | No |
| `POST` | `/api/reviews/:id/response` | Teacher response to review | Yes |

---

## ⚡ Socket.IO Events Reference

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join_conversation` | Client -> Server | `conversationId` | Join room for live thread |
| `leave_conversation` | Client -> Server | `conversationId` | Leave thread room |
| `new_message` | Server -> Client | `Message object` | Real-time chat message delivered |
| `typing_start` | Bidirectional | `{ conversationId, userId }` | Show typing indicator |
| `typing_stop` | Bidirectional | `{ conversationId, userId }` | Hide typing indicator |
| `messages_read` | Server -> Client | `{ conversationId, readBy }` | Read receipt update |
| `user_status` | Server -> Client | `{ userId, status: "online" \| "offline" }` | Presence tracking |

---

## 🧪 Testing with Postman or Curl

1. **Register User**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"fullName": "Dev User", "email": "dev@skillconnect.test", "password": "Password123!"}'
   ```
2. **Login & Extract Token**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "priya.sharma@example.com", "password": "Password123!"}'
   ```
3. **Use Bearer Token for Protected Calls**:
   ```bash
   curl -X GET http://localhost:5000/api/auth/me \
     -H "Authorization: Bearer <TOKEN_HERE>"
   ```

