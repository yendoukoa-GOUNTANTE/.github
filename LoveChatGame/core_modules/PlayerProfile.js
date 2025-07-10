// LoveChatGame/core_modules/PlayerProfile.js

/**
 * Manages player profiles.
 * For simplicity, this will use an in-memory store.
 * In a real game, this would connect to a database or a persistent storage solution.
 */

const players = {}; // In-memory store for player data

class PlayerProfile {
    constructor(playerId, name, interests = [], personalityTraits = {}) {
        if (players[playerId]) {
            throw new Error(`Player with ID ${playerId} already exists.`);
        }
        this.playerId = playerId;
        this.name = name;
        this.interests = new Set(interests); // e.g., ["gaming", "art", "music"]
        this.personalityTraits = personalityTraits; // e.g., { "kindness": 7, "humor": 8 }
        this.relationship_statuses = {}; // npcId: { score: 0, milestone: "acquaintance", chatHistory: [] }
        this.inventory = {}; // itemId: { quantity: 0, type: 'consumable'/'nft_collectible' }

        players[playerId] = this;
        console.log(`Player profile created for ${name} (ID: ${playerId})`);
    }

    static getPlayer(playerId) {
        return players[playerId];
    }

    static initializePlayer(playerId, name, interests, personalityTraits) {
        if (!players[playerId]) {
            return new PlayerProfile(playerId, name, interests, personalityTraits);
        }
        return players[playerId];
    }

    updateInterests(newInterests) {
        this.interests = new Set([...this.interests, ...newInterests]);
    }

    updatePersonality(trait, value) {
        this.personalityTraits[trait] = value;
    }

    getRelationshipWith(npcId) {
        if (!this.relationship_statuses[npcId]) {
            this.relationship_statuses[npcId] = {
                score: 0,
                milestone: "acquaintance",
                chatHistory: []
            };
        }
        return this.relationship_statuses[npcId];
    }

    addChatMessage(npcId, sender, message) {
        const relationship = this.getRelationshipWith(npcId);
        relationship.chatHistory.push({ sender, message, timestamp: new Date().toISOString() });
    }

    // Inventory methods will be expanded in the Inventory module
    addItemToInventory(itemId, quantity = 1, itemType = 'consumable') {
        if (!this.inventory[itemId]) {
            this.inventory[itemId] = { quantity: 0, type: itemType };
        }
        this.inventory[itemId].quantity += quantity;
        console.log(`${quantity} of ${itemId} (${itemType}) added to ${this.name}'s inventory.`);
    }

    viewProfile() {
        return {
            playerId: this.playerId,
            name: this.name,
            interests: Array.from(this.interests),
            personalityTraits: this.personalityTraits,
            relationships: this.relationship_statuses,
            inventory: this.inventory
        };
    }
}

module.exports = PlayerProfile;

// Example Usage (conceptual, would be in game logic)
/*
PlayerProfile.initializePlayer("player1", "Alex", ["gaming", "reading"], { "openness": 7 });
const playerAlex = PlayerProfile.getPlayer("player1");
if (playerAlex) {
    playerAlex.addItemToInventory("rose_nft", 1, "nft_collectible");
    console.log(playerAlex.viewProfile());
}
*/
