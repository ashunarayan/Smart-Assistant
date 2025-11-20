# 🤖 Smart Assistant

> An intelligent AI-powered assistant system with multi-step reasoning, secure authentication, and external tool integration.



##  Overview

Smart Assistant is a full-stack application that combines the power of Large Language Models (LLM) with practical tool execution capabilities. Users can perform complex tasks through natural language prompts, such as sending emails, searching the web, checking weather, and summarizing content—all secured with Google OAuth 2.0 authentication.

###  Key Features

-  **Agentic AI System**: Multi-step reasoning that chains multiple tools sequentially
-  **Secure Authentication**: Google OAuth 2.0 with session management
-  **Gmail Integration**: Send emails on behalf of authenticated users
-  **Web Search**: Google Custom Search API integration
-  **Weather Information**: Real-time weather data
-  **Text Summarization**: AI-powered content summarization
-  **Microservices Architecture**: Separated backend and tool execution server
-  **PostgreSQL Database**: Persistent user and session storage

##  Architecture

The project consists of **two main components**:

### 1. Backend Server (Port 3000)
- User authentication and session management
- LLM integration for intelligent decision-making
- Request routing and middleware protection
- Database operations

### 2. MCP Server (Port 4000)
- Tool execution engine
- External API integrations (Gmail, Search, Weather, Summarization)
- Isolated service for enhanced security and scalability

```
Frontend ──► Backend Server ──► LLM (GPT-4o) ──► MCP Server ──► External APIs
             (Port 3000)         (OpenAI)         (Port 4000)     (Gmail, Search, etc.)
                 │
                 ▼
            PostgreSQL
```

##  Project Structure

```
smart-assistant/
│
├── backend/                          # Main Backend Server
│   ├── server.js                     # Application Entry Point
│   ├── config/
│   │   ├── db.js                     # PostgreSQL Connection Pool
│   │   └── passport.js
│   ├── controllers/
│   │   ├── aiController.js           # AI Prompt Processing (Multi-step Agent)
│   │   └── authController.js         # Authentication Controllers
│   ├── middleware/
│   │   └── authMiddleware.js         # Protected Route Guard
│   ├── models/
│   │   └── userModel.js              # User Database Operations
│   ├── routes/
│   │   ├── aiRoutes.js               # /ai endpoint
│   │   └── authRoutes.js             # /auth/* endpoints
│   ├── services/
│   │   └── llmService.js             # OpenAI Integration
│   ├── passport/
│   │   └── passport.js               # Google OAuth Strategy
│   ├── migration/
│   │   ├── 001_create_user_table.sql # Database Schema
│   │   └── runMigration.js           # Migration Runner
│   ├── package.json
│   └── .env
│
├── mcp-server/                       # Tool Execution Server
│   ├── index.js                      # MCP Server Entry Point
│   ├── tools/
│   │   ├── gmailTool.js              # Gmail API Integration
│   │   ├── searchTool.js             # Google Custom Search
│   │   ├── weatherTool.js            # Weather Data
│   │   └── summarizeTool.js          # Text Summarization
│   ├── test.js
│   ├── package.json
│   └── .env
│
├── README.md
└── BACKEND_DOCUMENTATION.md          # Comprehensive Technical Documentation
```

