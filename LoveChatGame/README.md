# Love Chat Game (Conceptual Project)

## Overview

Love Chat Game is a conceptual project for a dating and relationship-building game. Players interact with AI-powered Non-Player Characters (NPCs) through dialogue, build relationships, exchange gifts (potentially as NFTs), and engage in shared activities within a conceptual "Sandbox" virtual world.

This repository contains the initial scaffolding and conceptual logic for such a game, implemented in JavaScript (Node.js environment assumed for module system).

## Core Features (Conceptual)

*   **Player and NPC Profiles**: Customizable profiles with interests, personality traits, and relationship statuses.
*   **AI-Powered Dialogue**: NPCs generate responses using a (currently mock) AI system, influenced by their personality and relationship with the player.
*   **Relationship Building**: A dynamic system where player choices and actions affect their relationship scores and milestones with NPCs.
*   **NFT Gifts & Achievements**: Conceptual integration of blockchain for unique in-game items (gifts, collectibles, achievements) represented as NFTs.
*   **Sandbox Integration**: Placeholder functions to simulate interactions within a generic virtual world (e.g., animations, shared activities, notifications).

## Project Structure

```
LoveChatGame/
├── core_modules/
│   ├── ai/
│   │   └── DialogueSystem.js       # Mock AI dialogue generation
│   ├── blockchain/
│   │   └── InventoryAndNFTs.js     # Manages inventory, conceptual NFT handling
│   ├── sandbox/
│   │   └── SandboxIntegration.js   # Simulates interaction with a virtual world
│   ├── NPCProfile.js             # Manages NPC data
│   └── PlayerProfile.js          # Manages player data
├── game_logic/
│   └── RelationshipLogic.js      # Handles relationship progression
├── npc_data/                     # Placeholder for external NPC definitions
├── player_data/                  # Placeholder for persistent player save data
├── main_game_loop.js             # Text-based simulation of the game
└── README.md                     # This file
```

## Modules Explained

### `core_modules/`

*   **`PlayerProfile.js`**:
    *   Manages player data: ID, name, interests, personality, inventory, and relationship statuses with various NPCs (including chat history).
*   **`NPCProfile.js`**:
    *   Manages NPC data: ID, name, interests, `corePersonality`, `descriptivePersonalityTags`, dialogue style.
    *   Includes a detailed `giftPreferences` structure, allowing NPCs to have nuanced preferences for different NFT types (e.g., `MusicTrackNFT`, `ArtPieceNFT`), specific item IDs, genres, visual styles, and rarities.
*   **`ai/DialogueSystem.js`**:
    *   **Conceptual AI**: Simulates AI-driven NPC responses. Uses keywords, relationship scores, NPC personality/style.
    *   Includes `getGiftReactionResponse` for specific dialogue upon receiving gifts.
    *   Enhanced to provide dialogue for movie date invitations (acceptance/rejection based on relationship score & personality) and contextual comments during/after a movie date via `getActivityContextualDialogue`.
    *   **Future AI Integration**: A real implementation would involve API calls to a backend service hosting a sophisticated language model (e.g., GPT, Claude) trained or fine-tuned for character-specific dialogue. The backend would handle the complexities of AI inference.
*   **`blockchain/InventoryAndNFTs.js`**:
    *   **Conceptual NFTs**: Manages the player's inventory. The `addItem` function is flexible enough to store various NFT types (`WearableAccessoryNFT`, `MusicTrackNFT`, `ArtPieceNFT`, `ExclusiveExperienceTicketNFT`, `PersonalizedCreationNFT`) with their specific metadata (e.g., genre, style_tag, rarity, slot).
    *   Includes placeholder functions (`mintOrTransferNFT`, `verifyNFTOwnershipOnChain`) that simulate blockchain interactions.
    *   **Future Blockchain Integration**: Would require:
        *   Smart contracts (e.g., ERC-721, ERC-1155 for NFTs) deployed on a chosen blockchain.
        *   A way for the game (likely via a backend or secure client-side wallet integration) to trigger smart contract functions.
        *   A way to query NFT ownership (e.g., reading contract state or using an indexer).
        *   Player wallet integration (e.g., MetaMask or a dedicated in-game wallet system).
    *   See `docs/nft_acquisition_methods.md` for conceptual ways players might acquire these NFTs.
*   **`docs/nft_acquisition_methods.md`**:
    *   A document detailing various conceptual methods for players to obtain NFTs within the game (e.g., quest rewards, achievements, in-game shop, crafting).
*   **`sandbox/SandboxIntegration.js`**:
    *   **Conceptual Sandbox**: Provides placeholder functions to simulate game actions manifesting in a virtual world.
    *   Enhanced to include more detailed logic for `initiateSandboxActivity` for a "virtual_movie_date", including NPC willingness checks (conceptual), teleportation simulation, movie selection, and returning enjoyment factors.
    *   **Future Sandbox Integration**: Would depend on the specific Sandbox platform chosen (e.g., The Sandbox Game, Decentraland, Roblox, Unreal Engine, Unity). Each platform has its own SDK/API for interacting with the game world, characters, and UI. The functions in this module would be implemented to call those specific SDK/API methods.

### `game_logic/`

*   **`RelationshipLogic.js`**:
    *   Calculates and updates relationship scores. The logic for "received_gift" interactions now uses the detailed NPC gift preference scores.
    *   The "completed_shared_activity" interaction now specifically handles `virtual_movie_date` by incorporating a `movieEnjoymentFactor` into the score change.
    *   Defines relationship milestones (e.g., acquaintance, friend, dating) that unlock new dialogue options or game content.

### `main_game_loop.js`

*   A script that runs a simple text-based simulation of the game.
*   Initializes player and NPC profiles.
*   Uses a command queue to simulate player input for interactions like talking to NPCs, giving gifts, and initiating activities.
*   Demonstrates how the different modules work together.

## Assumptions about "Sandbox" Environment

This project uses "Sandbox" as a generic term for a virtual world or metaverse platform. The `SandboxIntegration.js` module assumes such an environment would provide APIs/SDK functionalities for:

*   Retrieving character/object locations and states.
*   Controlling character animations and movements.
*   Displaying UI elements like notifications.
*   Triggering and managing in-world activities or mini-games.
*   Spawning and manipulating objects.
*   Player authentication and data persistence (though player profiles are in-memory here).

## How to Run the Simulation

1.  **Prerequisites**:
    *   Node.js installed (which includes npm).
2.  **Navigate to Project Root**:
    Open your terminal and change to the `LoveChatGame/` directory.
3.  **Run the Main Loop**:
    ```bash
    node main_game_loop.js
    ```
    The script will output a sequence of simulated interactions to the console. You can modify the `commandQueue` in `main_game_loop.js` to test different scenarios.

## Future Development Ideas

*   **GUI Implementation**: Replace the text-based loop with a graphical user interface (e.g., using HTML/CSS/JS for a web version, or a game engine like Unity/Unreal for a full 3D experience).
*   **Real AI Integration**: Connect `DialogueSystem.js` to a backend service using a powerful Language Model for dynamic and context-aware NPC conversations.
*   **Full Blockchain Implementation**:
    *   Develop and deploy smart contracts for NFT items.
    *   Integrate with a web3 library for wallet interactions and contract calls.
    *   Build a backend service to manage secure interactions with the blockchain if needed.
*   **Specific Sandbox Platform Integration**: Adapt `SandboxIntegration.js` to use the SDK of a chosen platform (e.g., The Sandbox Game's Game Maker and LUA scripting, Decentraland SDK, etc.).
*   **Persistent Data Storage**: Replace in-memory data stores with a database (e.g., MongoDB, PostgreSQL, Firebase) for player and NPC data.
*   **Expanded Gameplay**: More complex quests, date scenarios, group interactions, character customization, environment exploration.
*   **Monetization (Conceptual)**: Selling unique NFT gifts or cosmetic items.

This conceptual project provides a foundational blueprint for a "Love Chat Game" incorporating modern technologies.
