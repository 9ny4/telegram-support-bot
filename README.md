# telegram-support-bot

A Telegram support bot built with Telegraf. It answers FAQ questions via OpenRouter (GPT-4o-mini) and escalates unknown requests to an admin chat.

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
