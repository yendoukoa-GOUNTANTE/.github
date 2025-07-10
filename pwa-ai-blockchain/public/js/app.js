// Main application javascript

// --- PWA Service Worker Registration ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// --- AI Feature Placeholder ---
const fetchAiDataButton = document.getElementById('fetchAiData');
const aiOutputDiv = document.getElementById('ai-output');

// Mock function for fetching AI data
async function getMockAIResponse(prompt) {
    console.log("Mock AI: Received prompt - ", prompt);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (prompt.toLowerCase().includes("hello")) {
        return "Hello there! How can I assist you today?";
    } else if (prompt.toLowerCase().includes("recommend")) {
        return "Based on your preferences, I recommend trying out our new 'Smart Sort' feature!";
    } else {
        return "I'm a simple mock AI. I can respond to 'hello' or 'recommend'.";
    }
}

fetchAiDataButton.addEventListener('click', async () => {
    aiOutputDiv.textContent = 'Fetching AI response...';
    // For this placeholder, we'll use a fixed prompt or a user input if we add one.
    // Let's imagine the AI feature is a simple Q&A or recommendation.
    const userPrompt = "Tell me a recommendation."; // Example prompt
    try {
        const aiData = await getMockAIResponse(userPrompt);
        aiOutputDiv.textContent = aiData;
    } catch (error) {
        console.error("Error fetching AI data:", error);
        aiOutputDiv.textContent = 'Error fetching AI data.';
    }
});


// --- Blockchain Feature Placeholder (to be added in the next step) ---
const getBlockchainDataButton = document.getElementById('getBlockchainData');
const blockchainOutputDiv = document.getElementById('blockchain-output');

// Mock function for fetching Blockchain data
async function getMockBlockchainData(query) {
    console.log("Mock Blockchain: Received query - ", query);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    if (query === "latestBlock") {
        return `Latest Block: #${Math.floor(Math.random() * 100000) + 500000}, Hash: 0x${Math.random().toString(16).substr(2, 12)}`;
    } else if (query.startsWith("record:")) {
        const dataToRecord = query.split(":")[1];
        return `Data '${dataToRecord.substring(0,30)}...' recorded with mock transaction ID: 0x${Math.random().toString(16).substr(2, 24)}`;
    } else if (query === "tokenBalance") {
        return `Your token balance: ${Math.floor(Math.random() * 1000)} MKT (MockToken)`;
    } else {
        return "Unknown blockchain query. Try 'latestBlock', 'record:your_data', or 'tokenBalance'.";
    }
}

getBlockchainDataButton.addEventListener('click', async () => {
    blockchainOutputDiv.textContent = 'Fetching blockchain data...';
    // For this placeholder, we'll cycle through a few example queries.
    // A real app would have specific inputs for these.
    const queries = ["latestBlock", "record:ImportantDocumentHash123", "tokenBalance"];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    try {
        const blockchainData = await getMockBlockchainData(randomQuery);
        blockchainOutputDiv.textContent = blockchainData;
    } catch (error) {
        console.error("Error fetching blockchain data:", error);
        blockchainOutputDiv.textContent = 'Error fetching blockchain data.';
    }
});
