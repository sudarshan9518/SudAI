# SudAI

SudAI is a full-stack, real-time AI chat application built with the MERN stack. It pairs a React frontend with an Express/Socket.IO backend, and uses Google's Gemini models alongside a Pinecone vector store to give the assistant both short-term (recent conversation) and long-term (semantic) memory.

## Features

- 🔐 **Authentication** — register/login with JWT-based auth (cookie-based sessions, password hashing via bcrypt)
- 💬 **Real-time chat** — Socket.IO powers live messaging between the user and the AI
- 🧠 **Dual-memory AI** — combines Short-Term Memory (recent chat history from MongoDB) with Long-Term Memory (semantic recall via Pinecone embeddings) for context-aware responses
- 🗂️ **Chat management** — create, list, fetch messages for, and delete chats
- 🎨 **Modern frontend** — React 19 + Redux Toolkit + React Router, with light/dark theme support

## Tech Stack

**Frontend**
- React 19, React Router, Redux Toolkit
- Axios, Socket.IO client
- Vite

**Backend**
- Node.js, Express 5
- Socket.IO
- MongoDB with Mongoose
- Pinecone (vector database for long-term memory)
- Google Gemini (`@google/genai`) for text generation and embeddings
- JWT + bcrypt for authentication

## Project Structure

```
SudAI/
├── backend/
│   ├── server.js              # entry point
│   ├── src/
│   │   ├── app.js             # Express app & route mounting
│   │   ├── controllers/       # auth & chat controllers
│   │   ├── db/                # MongoDB connection
│   │   ├── middlewares/       # auth middleware
│   │   ├── models/            # Mongoose schemas (user, chat, message)
│   │   ├── routes/            # /api/auth, /api/chat
│   │   ├── services/          # ai.service.js (Gemini), vector.service.js (Pinecone)
│   │   └── sockets/           # Socket.IO server & ai-message event handling
│   └── public/                # static build output served by Express
└── frontend/
    └── src/
        ├── components/chat/   # chat UI components
        ├── pages/             # Home, Login, Register
        ├── store/              # Redux slices
        └── styles/             # theme
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB instance (local or Atlas)
- A [Pinecone](https://www.pinecone.io/) account with an index named `sudai`
- A Google Gemini API key ([Google AI Studio](https://aistudio.google.com/))

### 1. Clone the repo

```bash
git clone https://github.com/sudarshan9518/SudAI.git
cd SudAI
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URL=your_mongodb_connection_string
JWTSECRET=your_jwt_secret
PINECONE_API_KEY=your_pinecone_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Run the backend (listens on port 3000):

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` by default, which is the origin the backend is configured to accept for CORS and Socket.IO.

## API Overview

**Auth** (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Create a new user |
| POST | `/login` | Log in and receive a session cookie |
| POST | `/logout` | Log out |
| GET | `/verify` | Verify the current session |

**Chat** (`/api/chat`) — all routes require authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create a new chat |
| GET | `/` | List the user's chats |
| GET | `/messages/:id` | Get messages for a chat |
| DELETE | `/:id` | Delete a chat |

**Real-time (Socket.IO)**
- Client emits `ai-message` with `{ chat, content }`
- Server persists the message, generates an embedding, stores it in Pinecone, retrieves relevant long-term memory + recent chat history, generates an AI response with Gemini, and emits `ai-response` back to the client

## License

ISC
