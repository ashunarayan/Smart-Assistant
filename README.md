# Smart Assistant

A modular AI assistant system with:
- Node.js + Express backend (LLM integration)
- MCP server for tool execution (Gmail, Search, Summarize)

## Structure
```
smart-assistant/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── aiRoutes.js
│   ├── controllers/
│   │   └── aiController.js
│   ├── services/
│   │   └── llmService.js
│   ├── .env
│   └── package.json
│
├── mcp-server/
│   ├── index.js
│   ├── tools/
│   │   ├── gmailTool.js
│   │   ├── searchTool.js
│   │   └── summarizeTool.js
│   ├── package.json
│   └── .env
│
└── README.md
```

## Usage
1. Install dependencies in both `backend` and `mcp-server` folders:
   ```sh
   cd backend && npm install
   cd ../mcp-server && npm install
   ```
2. Start MCP server:
   ```sh
   npm start
   ```
3. Start backend:
   ```sh
   cd ../backend
   npm start
   ```

## Expandability
- Add new tools in `mcp-server/tools/` and update `index.js`.
- Update LLM system prompt in `backend/services/llmService.js`.
