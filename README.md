# telegram-support-bot

Telegram bot with AI-powered FAQ responses via OpenRouter + admin escalation for complex issues.
It combines fast automated answers with human handoff, so customers get help quickly when the bot can’t resolve a request.

## Demo

Screenshot coming soon

## Features

- FAQ responses powered by OpenRouter
- Escalates unknown questions to admin chat
- Environment-based configuration

## Setup

```bash
npm install
cp .env.example .env
# update BOT_TOKEN, ADMIN_CHAT_ID, OPENROUTER_API_KEY
```

## Run

```bash
npm start
```

## Environment Variables

- `BOT_TOKEN`
- `ADMIN_CHAT_ID`
- `OPENROUTER_API_KEY`
- `OPENROUTER_BASE_URL` (default https://openrouter.ai/api/v1)
- `OPENROUTER_MODEL` (default openai/gpt-4o-mini)
