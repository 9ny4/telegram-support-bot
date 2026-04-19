const test = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');

const { askLLM } = require('../bot');

const originalPost = axios.post;

test('askLLM returns content from OpenRouter response', async () => {
  axios.post = async () => ({
    data: {
      choices: [{ message: { content: 'Pricing is $199/month.' } }],
    },
  });

  const reply = await askLLM('What is the price?');
  assert.equal(reply, 'Pricing is $199/month.');

  axios.post = originalPost;
});
