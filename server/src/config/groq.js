const Groq = require('groq-sdk');

if (!process.env.GROQ_API_KEY) {
  throw new Error('Thiếu GROQ_API_KEY trong .env');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = { groq };
