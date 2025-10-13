const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

// Reddit API credentials (set these in your .env for security)
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const REDDIT_SECRET = process.env.REDDIT_SECRET;
const REDDIT_USER_AGENT = 'trail-shakedown-app/1.0';

// OpenAI API setup (set in your .env file as OPENAI_API_KEY)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_API_KEY ? new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY })) : null;

// Get Reddit access token
async function getRedditToken() {
  const response = await axios.post(
    'https://www.reddit.com/api/v1/access_token',
    'grant_type=client_credentials',
    {
      auth: {
        username: REDDIT_CLIENT_ID,
        password: REDDIT_SECRET
      },
      headers: {
        'User-Agent': REDDIT_USER_AGENT,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data.access_token;
}

// Fetch recent posts from r/ultralight
async function fetchUltralightPosts(limit = 10) {
  const token = await getRedditToken();
  const response = await axios.get(
    `https://oauth.reddit.com/r/ultralight/new?limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': REDDIT_USER_AGENT
      }
    }
  );
  return response.data.data.children.map(post => post.data);
}

// Summarize Reddit posts for gear recommendations using OpenAI
async function summarizeGearRecommendations(posts, userGearList) {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }
  
  // Prepare prompt with recent post titles and selftexts
  const postTexts = posts.map(p => `Title: ${p.title}\n${p.selftext || ''}`).join('\n---\n');
  const gearNames = userGearList.map(g => g.name).join(', ');
  const prompt = `You are an ultralight backpacking expert. Based on the following Reddit posts from r/ultralight, extract any gear recommendations relevant to these items: ${gearNames}. Only suggest swaps or upgrades that are mentioned or implied in the posts.\n\n${postTexts}`;

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an ultralight backpacking gear expert.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 500
  });
  return completion.data.choices[0].message.content;
}

module.exports = {
  fetchUltralightPosts,
  summarizeGearRecommendations
};
