# MCP Supabase Setup Guide for Direct SQL Execution

## Overview
This guide will enable direct SQL execution from Windsurf to your Supabase database.

## Step 1: Verify MCP Config

Your current config at `.codeium/windsurf/mcp_config.json` looks correct:
```json
{
  "mcpServers": {
    "supabase-mcp-server": {
      "args": ["@supabase/mcp-server-supabase@latest"],
      "command": "npx",
      "disabled": false,
      "env": {
        "SUPABASE_PROJECT_ID": "vzprjadkevuvdklctbuq",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cHJqYWRrZXZ1dmRrbGN0YnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE3OTY2NywiZXhwIjoyMDkwNzU1NjY3fQ.uTmA_VZksAeiRknuHJl4fKCa6ENQqRH6v0g89iwc2lI"
      }
    }
  }
}
```

## Step 2: Restart Windsurf

1. Close Windsurf completely
2. Reopen Windsurf
3. The MCP server should start automatically

## Step 3: Test Connection

Once restarted, I should be able to:
- List database tables
- Execute SQL queries
- View table schemas

## Step 4: Alternative Setup (If Above Doesn't Work)

### Option A: Install MCP Server Globally
```bash
npm install -g @supabase/mcp-server-supabase
```

### Option B: Use Different Server Name
Change config to use "supabase" instead of "supabase-mcp-server":
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_PROJECT_ID": "vzprjadkevuvdklctbuq",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cHJqYWRrZXZ1dmRrbGN0YnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE3OTY2NywiZXhwIjoyMDkwNzU1NjY3fQ.uTmA_VZksAeiRknuHJl4fKCa6ENQqRH6v0g89iwc2lI"
      }
    }
  }
}
```

## Security Note

⚠️ **The service role key provides full database access. Keep it secure!**

## After Setup

Once configured, I'll be able to:
1. Execute SQL migrations directly
2. Query database tables
3. Modify data without manual script execution
4. Verify changes in real-time

## Troubleshooting

If connection fails:
1. Check that the Supabase project is active
2. Verify the service role key hasn't expired
3. Ensure npx is available in your PATH
4. Try restarting Windsurf after config changes
