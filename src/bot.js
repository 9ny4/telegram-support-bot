require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

const FAQ_CONTEXT = `You are a helpful support agent for "PeakPath Coaching".
FAQ:
- Pricing: $199/month for weekly 1:1 coaching, $49/month for group sessions.
- Sessions: Monday-Thursday, 9am-6pm ET via Zoom.
- Cancellation: 24-hour notice for reschedules.
- Onboarding: Includes a 30-minute intake call and goal assessment.
If the answer is not in the FAQ, reply with "ESCALATE".`;

async function askLLM(question) {
  const payload = {
    model: MODEL,
    messages: [
      { role: 'system', content: FAQ_CONTEXT },
      { role: 'user', content: question },
    ],
    temperature: 0.2,
  };

  const response = await axios.post(
    `${OPENROUTER_BASE_URL}/chat/completions`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    }
  );

  return response.data.choices?.[0]?.message?.content?.trim();
}

function createBot(token) {
  const bot = new Telegraf(token);

  bot.start(async (ctx) => {
    await ctx.reply(
      "Welcome to PeakPath Coaching support! Send me a question about pricing, sessions, cancellations, or onboarding and I'll answer from our FAQ. If it's outside the FAQ, I'll loop in a human coach."
    );
  });

  bot.on('text', async (ctx) => {
    const userMessage = ctx.message?.text;
    if (!userMessage || !userMessage.trim()) {
      await ctx.reply('Thanks! Please send a text question so I can help.');
      return;
    }

    let reply;
    try {
      reply = await askLLM(userMessage);
    } catch (err) {
      console.error('askLLM error:', err.message);
      await ctx.reply('Sorry, something went wrong on our end. Please try again in a moment.');
      return;
    }

    if (!reply || reply.toUpperCase().includes('ESCALATE')) {
      await ctx.reply('Thanks! A human coach will follow up shortly.');
      if (ADMIN_CHAT_ID) {
        try {
          await ctx.telegram.sendMessage(
            ADMIN_CHAT_ID,
            `Escalation from ${ctx.from.username || ctx.from.id}: ${userMessage}`
          );
        } catch (err) {
          console.error('Failed to notify admin:', err.message);
        }
      }
      return;
    }

    await ctx.reply(reply);
  });

  return bot;
}

// Only start the bot when run directly (not when required by tests)
if (require.main === module) {
  if (!BOT_TOKEN) {
    console.error('BOT_TOKEN missing');
    process.exit(1);
  }
  const bot = createBot(BOT_TOKEN);
  bot.launch();
  console.log('Support bot started');

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

module.exports = { askLLM, createBot };
