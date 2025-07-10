// LoveChatGame/main_game_loop.js
// Basic Text-Based Simulation of the Love Chat Game

const PlayerProfile = require('./core_modules/PlayerProfile');
const NPCProfile = require('./core_modules/NPCProfile');
const DialogueSystem = require('./core_modules/ai/DialogueSystem');
const RelationshipLogic = require('./game_logic/RelationshipLogic');
const InventoryAndNFTs = require('./core_modules/blockchain/InventoryAndNFTs');
const SandboxIntegration = require('./core_modules/sandbox/SandboxIntegration');

// --- Game Setup ---
let currentPlayerId = null;
// const npcsInScene = ["npc_elara", "npc_kai", "npc_rian"]; // NPCs available to interact with (now derived from NPCProfile.npcs)

function initializeGame() {
    console.log("Initializing Love Chat Game...");

    // Create Player
    PlayerProfile.initializePlayer("player1", "Alex", ["gaming", "art", "music"], { "kindness": 8, "humor": 7 });
    currentPlayerId = "player1";

    // Create NPCs
    NPCProfile.initializeNPC(
        "npc_elara", "Elara",
        ["astronomy", "poetry", "art"], // Interests
        { "intellect": 8, "patience": 9 }, // Core Personality Traits
        ["dreamy", "introverted", "bookworm", "optimistic"], // Descriptive Personality Tags
        "thoughtful", // Dialogue Style
        { likesInterestsInCommon: 3, giftPreferences: { "star_chart_nft": 15, "poem_book_common": 5, "painting_tools_rare": 10 } } // Relationship Factors
    );
    NPCProfile.initializeNPC(
        "npc_kai", "Kai",
        ["music", "skateboarding", "gaming"], // Interests
        { "creativity": 9, "wit": 6 }, // Core Personality Traits
        ["extroverted", "energetic", "sarcastic", "laid_back", "adventurous"], // Descriptive Personality Tags
        "friendly", // Dialogue Style
        { likesInterestsInCommon: 2, giftPreferences: { "concert_ticket_nft": 20, "new_deck_rare": 12, "gaming_headset_common": 5 } } // Relationship Factors
    );
    NPCProfile.initializeNPC(
        "npc_rian", "Rian",
        ["philosophy", "history", "chess"], // Interests
        { "analytical": 9, "patience": 7 }, // Core
        ["jaded", "pessimistic", "analytical", "introverted"], // Descriptive
        "formal", // Dialogue Style
        { likesInterestsInCommon: 1, giftPreferences: { "old_tome_nft": 25, "chess_set_rare": 10 }, prefersCompliments: false }
    );

    // Give player some initial items (conceptual)
    InventoryAndNFTs.addItem(currentPlayerId, "poem_book_common", 1, "collectible_common", { description: "A book of classic poems." });
    InventoryAndNFTs.addItem(currentPlayerId, "star_chart_nft", 1, "collectible_rare_nft", {
        description: "A beautiful animated star chart NFT.",
        token_id: "SC789",
        rarity: "rare"
    });

    console.log("\nGame Initialized! Player Alex, Elara, and Kai are ready.");
    console.log("----------------------------------------------------");
}

// --- Mock Input Function (for text-based simulation) ---
// In a real game, this would come from a UI.
// For this simulation, we'll use a simple array of commands.
let commandQueue = [];
let currentNpcInteractionTarget = null;

function mockGetPlayerInput() {
    if (commandQueue.length > 0) {
        const command = commandQueue.shift();
        console.log(`\n> ALEX (Input): ${command}`);
        return command;
    }
    // If no commands, simulate some idle time or end interaction
    if (currentNpcInteractionTarget) {
        console.log(`(No more commands for ${currentNpcInteractionTarget.name}. Type 'exit' to choose another NPC or 'quit' to end game.)`);
    } else {
         console.log(`(No commands. Type 'talk <npc_name>', 'inventory', 'profile', or 'quit'.)`);
    }
    return null; // Or prompt user in a real console app
}

// --- Main Game Loop (Conceptual) ---
async function gameLoop() {
    let playing = true;

    while (playing) {
        if (!currentNpcInteractionTarget) {
            // Player is not currently talking to an NPC
            const baseCommand = mockGetPlayerInput();
            if (!baseCommand) { // Allow for empty input to re-prompt or if queue is empty
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait a bit
                continue;
            }

            if (baseCommand.startsWith("talk ")) {
                const targetName = baseCommand.split(" ")[1];
                const targetNpc = Object.values(NPCProfile.npcs).find(npc => npc.name.toLowerCase() === targetName.toLowerCase());
                if (targetNpc) {
                    currentNpcInteractionTarget = targetNpc;
                    console.log(`\n--- Interacting with ${currentNpcInteractionTarget.name} ---`);
                    await SandboxIntegration.triggerSandboxAnimation(currentPlayerId, "approach");
                    await SandboxIntegration.triggerSandboxAnimation(currentNpcInteractionTarget.npcId, "turn_to_player");
                    console.log(`${currentNpcInteractionTarget.name}: Oh, hi ${PlayerProfile.getPlayer(currentPlayerId).name}! What's up?`);
                } else {
                    console.log(`NPC "${targetName}" not found.`);
                }
            } else if (baseCommand === "inventory") {
                const inventory = InventoryAndNFTs.getPlayerInventory(currentPlayerId);
                console.log("ALEX's Inventory:", inventory);
            } else if (baseCommand === "profile") {
                console.log("ALEX's Profile:", PlayerProfile.getPlayer(currentPlayerId).viewProfile());
            }
             else if (baseCommand === "quit") {
                playing = false;
                console.log("Quitting game...");
            } else if (baseCommand) {
                console.log("Unknown command. Try: 'talk <npc_name>', 'inventory', 'profile', 'quit'.");
            }

        } else {
            // Player is interacting with currentNpcInteractionTarget
            const playerInput = mockGetPlayerInput();

            if (playerInput) {
                if (playerInput.toLowerCase() === "exit") {
                    console.log(`\n--- Ending interaction with ${currentNpcInteractionTarget.name} ---`);
                    await SandboxIntegration.triggerSandboxAnimation(currentPlayerId, "wave_goodbye");
                    await SandboxIntegration.triggerSandboxAnimation(currentNpcInteractionTarget.npcId, "wave_goodbye");
                    currentNpcInteractionTarget = null;
                    continue;
                }

                // 1. Get NPC Dialogue Response
                const npcResponse = await DialogueSystem.getNPCResponse(currentPlayerId, currentNpcInteractionTarget.npcId, playerInput);
                console.log(`${currentNpcInteractionTarget.name}: ${npcResponse}`);
                await SandboxIntegration.displaySandboxNotification(currentPlayerId, `${currentNpcInteractionTarget.name} says: "${npcResponse.substring(0, 50)}..."`, "dialogue");


                // 2. Update Relationship (simplified for this demo)
                // More complex logic would analyze playerInput and npcResponse
                if (playerInput.toLowerCase().includes("love") || playerInput.toLowerCase().includes("like you")) {
                    RelationshipLogic.updateRelationshipScore(currentPlayerId, currentNpcInteractionTarget.npcId, "positive_dialogue", { intensity: 2 });
                } else if (currentNpcInteractionTarget.interests.some(interest => playerInput.includes(interest))) {
                    RelationshipLogic.updateRelationshipScore(currentPlayerId, currentNpcInteractionTarget.npcId, "shared_interest_discussed", { interestsInCommon: 1 });
                } else {
                    RelationshipLogic.updateRelationshipScore(currentPlayerId, currentNpcInteractionTarget.npcId, "positive_dialogue");
                }

                // 3. Conceptual Gift Giving
                if (playerInput.toLowerCase().startsWith("give ")) {
                    const itemName = playerInput.split(" ")[1];
                    if (InventoryAndNFTs.checkOwnership(currentPlayerId, itemName)) {
                        console.log(`ALEX: I'd like to give you this ${itemName}.`);
                        await SandboxIntegration.triggerSandboxAnimation(currentPlayerId, "offer_gift");
                        await SandboxIntegration.spawnObjectInWorld(itemName, {x:0,y:0,z:0} /* target NPC pos */, currentNpcInteractionTarget.npcId);

                        const giftImpact = RelationshipLogic.updateRelationshipScore(currentPlayerId, currentNpcInteractionTarget.npcId, "received_gift", { itemId: itemName });
                        InventoryAndNFTs.removeItem(currentPlayerId, itemName);

                        if (giftImpact && giftImpact.score > 0) {
                             console.log(`${currentNpcInteractionTarget.name}: Oh, for me? Thank you, Alex! That's so thoughtful!`);
                             await SandboxIntegration.triggerSandboxAnimation(currentNpcInteractionTarget.npcId, "accept_gift_happy");
                        } else {
                            console.log(`${currentNpcInteractionTarget.name}: Oh. Uh, thanks, Alex.`);
                            await SandboxIntegration.triggerSandboxAnimation(currentNpcInteractionTarget.npcId, "accept_gift_neutral");
                        }
                        if (itemName.includes("_nft")) {
                            await InventoryAndNFTs.mintOrTransferNFT(currentNpcInteractionTarget.npcId, itemName, `mock_token_given_${Date.now()}`); // Conceptual transfer
                            await SandboxIntegration.displaySandboxNotification(currentNpcInteractionTarget.npcId, `You received ${itemName} (NFT) from Alex!`, "achievement");
                        }
                    } else {
                        console.log(`ALEX: (I don't have a ${itemName} to give.)`);
                    }
                }

                // 4. Conceptual Shared Activity
                if (playerInput.toLowerCase().includes("go for a walk") || playerInput.toLowerCase().includes("hang out")) {
                    console.log(`ALEX: Hey ${currentNpcInteractionTarget.name}, want to go for a walk in the Sandbox Park?`);
                    // NPC decides based on relationship, personality (mocked)
                    const playerProfile = PlayerProfile.getPlayer(currentPlayerId);
                    const relationship = playerProfile.getRelationshipWith(currentNpcInteractionTarget.npcId);
                    if (relationship.score > RelationshipLogic.milestones.friend_budding) {
                        console.log(`${currentNpcInteractionTarget.name}: A walk? Sure, Alex, that sounds nice!`);
                        await SandboxIntegration.initiateSandboxActivity(currentPlayerId, currentNpcInteractionTarget.npcId, "walk_in_park");
                        RelationshipLogic.updateRelationshipScore(currentPlayerId, currentNpcInteractionTarget.npcId, "completed_shared_activity", { activityValue: 5, activityEnjoyedByNPC: true });
                        console.log(`(You and ${currentNpcInteractionTarget.name} enjoy a pleasant walk in the virtual park.)`);
                        // End interaction after activity for this simple loop
                        currentNpcInteractionTarget = null;
                    } else {
                        console.log(`${currentNpcInteractionTarget.name}: Hmm, maybe some other time, Alex.`);
                    }
                }


            } else { // No input from queue for current NPC
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait a bit
                // If interaction has been idle for too long, could auto-exit
                // For now, just waits for more commands or 'exit'
            }
        }
        if (playing && commandQueue.length === 0 && !currentNpcInteractionTarget) {
             // If queue is empty and not talking to anyone, prompt for base command again
        } else if (playing && commandQueue.length === 0 && currentNpcInteractionTarget) {
            // If queue is empty but talking to someone, prompt for interaction command again
        }


        if (!playing) break;
    }
    console.log("\n--- Game Over ---");
}

// --- Start the Game ---
initializeGame();

// --- Populate Command Queue for Simulation ---
commandQueue = [
    "profile",
    "inventory",
    "talk elara", // Start talking to Elara
    "hello there!",
    "i heard you like art and poetry?",
    "give poem_book_common", // Give Elara the common poem book
    "i also have this star_chart_nft for you", // This will still fail as "give" keyword is needed.
    "give star_chart_nft", // Give Elara the NFT (Elara: dreamy, introverted, bookworm, optimistic)
    "how are you doing today elara?", // Elara should be optimistic
    "what are your plans for the future?", // Elara (optimistic) vs Kai (laid_back/adventurous) vs Rian (pessimistic/jaded)
    "let's go for a walk sometime?", // Test Elara's introverted nature vs. relationship score
    "exit", // Stop talking to Elara

    "talk kai", // Start talking to Kai (extroverted, energetic, sarcastic, laid_back, adventurous)
    "hey kai, what's up?", // Kai should be energetic/extroverted
    "i like music and gaming too!", // Kai is interested
    "how are you?", // Kai should be laid_back
    "what do you think about the future?", // Kai should be laid_back/adventurous
    "give concert_ticket_nft", // Assuming player has this (add to inventory for test)
    "wanna hang out in the sandbox?", // Kai might be more open due to adventurous/extroverted
    "exit",

    "talk rian", // Start talking to Rian (jaded, pessimistic, analytical, introverted)
    "hello rian.", // Rian should be formal/introverted
    "how are you today?", // Rian should be pessimistic/jaded
    "i find philosophy interesting.", // Rian is interested, but analytical
    "what are your thoughts on the future?", // Rian should be pessimistic/jaded
    "i have a gift for you.", // Rian's reaction to gift intent (jaded?)
    "exit",

    "quit"
];

// Add concert_ticket_nft to player inventory for Kai interaction
InventoryAndNFTs.addItem(currentPlayerId, "concert_ticket_nft", 1, "collectible_rare_nft", {
    description: "Exclusive ticket to that band Kai likes.",
    token_id: "CT456",
    rarity: "rare"
});


gameLoop();
