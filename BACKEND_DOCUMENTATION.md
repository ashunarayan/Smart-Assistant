# Smart Assistant - Backend Documentation

##  Project Overview

**Project Name:** Smart Assistant Backend System  
**Developer:** [Ashutosh Narayan Srivastava]  
**Role:** Backend Developer  
**Technology Stack:** Node.js, Express.js, PostgreSQL, OAuth 2.0, OpenAI API  
**Date:** 21November 2025

---

##  Executive Summary

The Smart Assistant Backend is an intelligent, multi-layered system that integrates Large Language Models (LLMs) with external tool execution capabilities. The system enables users to perform complex tasks through natural language prompts, such as sending emails, searching the web, and retrieving weather information—all secured with Google OAuth 2.0 authentication.

### Key Achievements:
-  **Agentic AI Architecture**: Implemented multi-step reasoning where LLM can chain multiple tools sequentially
-  **Secure Authentication**: Google OAuth 2.0 with session management and PostgreSQL user storage
-  **Modular Design**: Separation of concerns with MVC architecture and microservices pattern
-  **Tool Orchestration**: MCP (Model Context Protocol) server managing external integrations
-  **Production-Ready**: Error handling, logging, and environment configuration

---

##  System Architecture

The project consists of **two main components**:

### 1. **Backend Server** (Port 3000)
- User authentication and session management
- LLM integration for decision-making
- Request routing and middleware protection
- Database operations

### 2. **MCP Server** (Port 4000)
- Tool execution engine
- External API integrations (Gmail, Search, Weather, Summarization)
- Isolated service for better security and scalability

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    (Partner's Work)                          │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP Requests
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER (Port 3000)                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │
│  │   Routes     │──▶│ Controllers  │──▶│   Services   │   │
│  │              │   │              │   │              │   │
│  │ - /auth/*    │   │ aiController │   │ llmService   │   │
│  │ - /ai        │   │ authCtrl     │   │              │   │
│  └──────────────┘   └──────────────┘   └──────┬───────┘   │
│                                                │           │
│  ┌──────────────┐   ┌──────────────┐         │           │
│  │  Middleware  │   │    Models    │         │           │
│  │              │   │              │         │           │
│  │ - Auth Check │   │ - User Model │         │           │
│  │ - Passport   │   │              │         │           │
│  └──────────────┘   └──────┬───────┘         │           │
│                            │                 │           │
│                            ▼                 ▼           │
│                     ┌──────────────┐  ┌──────────────┐  │
│                     │  PostgreSQL  │  │  OpenAI API  │  │
│                     │   Database   │  │   (GPT-4o)   │  │
│                     └──────────────┘  └──────┬───────┘  │
└───────────────────────────────────────────────┼──────────┘
                                                │
                                                │ Tool Execution Request
                                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   MCP SERVER (Port 4000)                     │
├─────────────────────────────────────────────────────────────┤
│                     ┌──────────────┐                        │
│                     │ Tool Router  │                        │
│                     └──────┬───────┘                        │
│                            │                                │
│     ┌──────────────┬───────┴───────┬──────────────┐        │
│     ▼              ▼               ▼              ▼        │
│ ┌────────┐   ┌─────────┐   ┌──────────┐   ┌──────────┐   │
│ │ Gmail  │   │ Search  │   │ Weather  │   │Summarize │   │
│ │  Tool  │   │  Tool   │   │   Tool   │   │   Tool   │   │
│ └───┬────┘   └────┬────┘   └─────┬────┘   └─────┬────┘   │
│     │             │              │              │        │
└─────┼─────────────┼──────────────┼──────────────┼────────┘
      │             │              │              │
      ▼             ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  Gmail   │  │  Google  │  │ Weather  │  │ OpenAI   │
│   API    │  │  Search  │  │   API    │  │Summarize │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

---

##  Project Structure

```
smart-assistant/
│
├── backend/                          # Main Backend Server
│   ├── server.js                     # Application Entry Point
│   │
│   ├── config/                       # Configuration Files
│   │   ├── db.js                     # PostgreSQL Connection Pool
│   │   └── passport.js               # (Legacy - Not Used)
│   │
│   ├── controllers/                  # Request Handlers
│   │   ├── aiController.js           # AI Prompt Processing Logic
│   │   └── authController.js         # Authentication Controllers
│   │
│   ├── middleware/                   # Express Middleware
│   │   └── authMiddleware.js         # Protected Route Guard
│   │
│   ├── models/                       # Database Models
│   │   └── userModel.js              # User CRUD Operations
│   │
│   ├── routes/                       # API Route Definitions
│   │   ├── aiRoutes.js               # /ai endpoint
│   │   └── authRoutes.js             # /auth/* endpoints
│   │
│   ├── services/                     # Business Logic Layer
│   │   └── llmService.js             # OpenAI Integration
│   │
│   ├── passport/                     # Passport.js Configuration
│   │   └── passport.js               # Google OAuth Strategy
│   │
│   ├── migration/                    # Database Setup
│   │   ├── 001_create_user_table.sql # SQL Schema
│   │   └── runMigration.js           # Migration Runner
│   │
│   ├── package.json                  # Backend Dependencies
│   └── .env                          # Environment Variables
│
└── mcp-server/                       # Tool Execution Server
    ├── index.js                      # MCP Server Entry Point
    ├── test.js                       # Testing Utilities
    │
    ├── tools/                        # Individual Tool Modules
    │   ├── gmailTool.js              # Email Sending via Gmail API
    │   ├── searchTool.js             # Web Search (Google Custom Search)
    │   ├── weatherTool.js            # Weather Information
    │   └── summarizeTool.js          # Text Summarization
    │
    ├── package.json                  # MCP Dependencies
    └── .env                          # MCP Environment Variables
```

---

##  Authentication System

### Technology Used:
- **Passport.js** with Google OAuth 2.0 Strategy
- **Express-Session** for session persistence
- **PostgreSQL** for user data storage

### Authentication Flow:

```
1. User clicks "Login with Google"
   ↓
2. Redirected to Google OAuth consent screen
   ↓
3. User grants permissions (profile, email, gmail.send)
   ↓
4. Google redirects back with authorization code
   ↓
5. Passport exchanges code for Access + Refresh Tokens
   ↓
6. User data stored/updated in PostgreSQL
   ↓
7. Session created and stored server-side
   ↓
8. User redirected to /dashboard
```

### Key Files:

**`backend/passport/passport.js`**
- Configures Google OAuth 2.0 strategy
- Handles user serialization/deserialization
- Stores refresh tokens for Gmail API access

**`backend/middleware/authMiddleware.js`**
- Protects routes requiring authentication
- Returns 401 for unauthorized API calls
- Redirects to login for web requests

**`backend/models/userModel.js`**
- Database operations for user management
- `findUserByGoogleId()` - Retrieve user
- `createOrUpdateUser()` - Upsert user with tokens

### Database Schema:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

##  AI Agent Architecture

### Overview:
The AI system uses **OpenAI's GPT-4o-mini** as an intelligent orchestrator that can:
1. Understand natural language requests
2. Decide which tools to use
3. Chain multiple tools together for complex tasks
4. Provide conversational responses

### Multi-Step Reasoning Process:

```javascript
// Example: "Search for gravity and email the result to john@example.com"

Step 1: LLM decides → Use search_tool with query="gravity"
        ↓
Step 2: Search tool returns results
        ↓
Step 3: LLM receives search results
        ↓
Step 4: LLM decides → Use gmail_tool with search results in body
        ↓
Step 5: Email sent successfully
        ↓
Step 6: LLM returns final response to user
```

### Implementation (`backend/controllers/aiController.js`):

```javascript
// Conversation Memory Approach
let messages = [{ role: "user", content: prompt }];
let steps = 0;
const MAX_STEPS = 5;

while (steps < MAX_STEPS) {
    // 1. Ask LLM what to do next
    const llmResult = await llmService.decideAction(messages);
    
    // 2. If LLM wants to respond, we're done
    if (llmResult.action === 'respond') {
        return res.json({ result: llmResult.parameters.response });
    }
    
    // 3. Execute the tool
    const toolOutput = await axios.post('http://localhost:4000/execute', {
        tool: llmResult.action,
        parameters: executionParams
    });
    
    // 4. Add tool result to conversation memory
    messages.push({ 
        role: "assistant", 
        content: JSON.stringify(llmResult) 
    });
    messages.push({ 
        role: "user", 
        content: `Tool Output: ${toolOutput}` 
    });
    
    steps++;
}
```

### System Prompt (`backend/services/llmService.js`):

The LLM is guided by a carefully crafted system prompt that:
- Lists available tools and their parameters
- Defines the decision-making process
- Enforces JSON output format
- Encourages multi-step reasoning

---

##  MCP Server - Tool Execution Engine

### Purpose:
The MCP (Model Context Protocol) Server is a **separate microservice** that handles all external integrations. This separation provides:
- **Security**: Sensitive API keys isolated from main backend
- **Scalability**: Can be deployed independently
- **Maintainability**: Easy to add new tools

### Tool Registry (`mcp-server/index.js`):

```javascript
const tools = {
  gmail_tool: gmailTool,
  search_tool: searchTool,
  summarize_tool: summarizeTool,
  weather_tool: weatherTool,
};

app.post("/execute", async (req, res) => {
  const { tool, parameters } = req.body;
  const selectedTool = tools[tool];
  const result = await selectedTool.execute(parameters);
  res.json({ tool, result });
});
```

---

##  Gmail Tool - Deep Dive

### Challenge Solved:
Sending emails on behalf of authenticated users using OAuth 2.0 tokens.

### Technical Implementation:

**Method 1 (Nodemailer)** - Initially attempted but had token issues  
**Method 2 (Gmail REST API)** - Current implementation 

```javascript
// Using Google's Gmail API v1
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

// Construct MIME email
const messageParts = [
  `From: <${auth.userEmail}>`,
  `To: <${to}>`,
  `Subject: ${utf8Subject}`,
  `Content-Type: text/plain; charset=utf-8`,
  ``,
  body
];

// Base64URL encode
const encodedMessage = Buffer.from(message.join('\n'))
  .toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');

// Send via API
await gmail.users.messages.send({
  userId: 'me',
  requestBody: { raw: encodedMessage }
});
```

### OAuth Flow for Gmail:
1. User logs in via Google OAuth
2. Backend requests `gmail.send` scope
3. Refresh token stored in database
4. When sending email, refresh token exchanged for access token
5. Access token used to authenticate Gmail API request

---

##  Search Tool

**API Used:** Google Custom Search API

```javascript
// Returns top search results for any query
const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
  params: {
    key: process.env.GOOGLE_API_KEY,
    cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
    q: query,
  },
});

return results.map(item => ({
  title: item.title,
  link: item.link,
  snippet: item.snippet,
}));
```

**Use Case:** "Search for the latest news on AI" → Returns structured search results

---

##  Weather Tool

**API Used:** Weather service (implementation details in `weatherTool.js`)

**Use Case:** "What's the weather in Delhi?" → Returns current weather data

---

##  Summarize Tool

**Technology:** OpenAI GPT models for text summarization

**Use Case:** "Summarize this article: [long text]" → Returns concise summary

---

##  Database Architecture

### PostgreSQL Configuration:

**File:** `backend/config/db.js`

```javascript
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});
```

##  API Endpoints

### Authentication Routes (`/auth`)

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/auth/google` | GET | Initiate Google OAuth login | None |
| `/auth/google/callback` | GET | OAuth callback handler | None |
| `/auth/logout` | GET | Destroy session and logout | Required |

### AI Routes (`/ai`)

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/ai` | POST | Process natural language prompt | Required |

**Request Body:**
```json
{
  "prompt": "Search for Python tutorials and email results to me"
}
```

**Response:**
```json
{
  "success": true,
  "action": "respond",
  "result": "I've searched for Python tutorials and sent the results to your email."
}
```

### Protected Routes

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/dashboard` | GET | User dashboard | Required |

---

##  Environment Configuration

### Backend `.env`:
```env
# Server Configuration
PORT=3000

# Database
DB_USER=postgres
DB_HOST=localhost
DB_NAME=smart_assistant
DB_PASS=yourpassword
DB_PORT=5432

# Session
SESSION_SECRET=your_random_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://localhost:3000/auth/google/callback

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key
```

### MCP Server `.env`:
```env
# Server Configuration
PORT=4000

# Google Services
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://localhost:3000/auth/google/callback
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id

# OpenAI (for summarization)
OPENAI_API_KEY=sk-your-openai-api-key
```

---



