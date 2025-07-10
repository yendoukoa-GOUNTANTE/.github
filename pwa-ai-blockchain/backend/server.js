const express = require('express');
const cors = require('cors'); // For enabling Cross-Origin Resource Sharing

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes (customize in production)
app.use(express.json()); // To parse JSON request bodies

// --- Placeholder AI Proxy Route ---
app.post('/api/ai-proxy', async (req, res) => {
    const userPrompt = req.body.prompt;
    console.log(`[Backend] Received AI prompt: ${userPrompt}`);

    // In a real scenario:
    // 1. Securely fetch your AI service API key (e.g., from environment variables)
    // 2. Make a request to the actual AI service (e.g., OpenAI, Google AI)
    //    const aiResponse = await fetch('AI_SERVICE_URL', {
    //        method: 'POST',
    //        headers: { 'Authorization': `Bearer ${process.env.AI_API_KEY}`, 'Content-Type': 'application/json' },
    //        body: JSON.stringify({ prompt: userPrompt, ...otherAiParams })
    //    });
    //    const data = await aiResponse.json();
    //    res.json(data);

    // Mock response for now
    let mockResponse = "I'm a simple mock AI from the backend. I can respond to 'hello' or 'recommend'.";
    if (userPrompt && userPrompt.toLowerCase().includes("hello")) {
        mockResponse = "Hello there from the backend proxy! How can I assist you today?";
    } else if (userPrompt && userPrompt.toLowerCase().includes("recommend")) {
        mockResponse = "From the backend: I recommend exploring containerization with Docker!";
    }

    setTimeout(() => { // Simulate network delay
        res.json({ response: mockResponse });
    }, 500);
});

// --- Placeholder Blockchain Proxy Route ---
app.post('/api/blockchain-proxy', async (req, res) => {
    const query = req.body.query;
    const params = req.body.params; // e.g., data to record
    console.log(`[Backend] Received blockchain query: ${query}, Params: ${JSON.stringify(params)}`);

    // In a real scenario:
    // 1. Connect to a blockchain node or use a blockchain SDK (Web3.js, Ethers.js)
    // 2. For read operations: query the blockchain.
    // 3. For write operations: construct and sign transactions (this is complex and often involves user-side signing).
    //    This proxy might be better suited for read operations or for interacting with a custodial service.

    // Mock response for now
    let mockData = "Unknown blockchain query from backend.";
    if (query === "latestBlock") {
        mockData = `Backend Mock: Latest Block: #${Math.floor(Math.random() * 100000) + 700000}, Hash: 0x${Math.random().toString(16).substr(2, 15)}`;
    } else if (query === "record" && params && params.data) {
        mockData = `Backend Mock: Data '${params.data.substring(0,30)}...' (conceptually) recorded. TxID: 0x${Math.random().toString(16).substr(2, 28)}`;
    } else if (query === "tokenBalance") {
        mockData = `Backend Mock: Your token balance: ${Math.floor(Math.random() * 2000)} MKT`;
    }

    setTimeout(() => { // Simulate network delay
        res.json({ data: mockData });
    }, 700);
});

app.get('/', (req, res) => {
    res.send('PWA Backend Proxy is running. Use POST requests for /api/ai-proxy or /api/blockchain-proxy.');
});

app.listen(port, () => {
    console.log(`Conceptual backend server listening at http://localhost:${port}`);
});
