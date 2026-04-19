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

test('askLLM returns ESCALATE for unknown questions', async () => {
  axios.post = async () => ({
    data: {
      choices: [{ message: { content: 'ESCALATE' } }],
    },
  });

  const reply = await askLLM('Can I get a refund after 60 days?');
  assert.equal(reply, 'ESCALATE');

  axios.post = originalPost;
});

test('askLLM returns undefined when choices array is empty', async () => {
  axios.post = async () => ({
    data: { choices: [] },
  });

  const reply = await askLLM('What are the hours?');
  assert.equal(reply, undefined);

  axios.post = originalPost;
});

test('askLLM throws when axios rejects (network error)', async () => {
  axios.post = async () => {
    throw new Error('Network Error');
  };

  await assert.rejects(
    () => askLLM('What is the price?'),
    /Network Error/
  );

  axios.post = originalPost;
});
