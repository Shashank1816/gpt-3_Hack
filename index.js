const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const openai = require('openai');

// Set up OpenAI API key
openai.api_key = "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";

// Define function to generate GPT-3 response
async function generateResponse(prompt) {
  const response = await openai.complete({
    engine: 'davinci',
    prompt: prompt,
    maxTokens: 1024,
    n: 1,
    stop: null,
    temperature: 0.5,
  });
  return response.choices[0].text.trim();
}

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define webhook route
app.post('/webhook', async (req, res) => {
    console.log("Working webhook");
    res.json("Working fine");
  const intentName = req.body.queryResult.intent.displayName;
  if (intentName === 'gpt3_intent') {
    // Get user input
    const prompt = req.body.queryResult.queryText;
    // Generate GPT-3 response
    const responseText = await generateResponse(prompt);
    // Build Dialogflow fulfillment response
    const fulfillmentText = {
      fulfillmentText: responseText,
    };
    // Return fulfillment response
    res.json(fulfillmentText);
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})
