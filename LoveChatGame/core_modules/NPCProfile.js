// LoveChatGame/core_modules/NPCProfile.js

/**
 * Manages NPC (Non-Player Character) profiles.
 * Uses an in-memory store for simplicity.
 */

const npcs = {}; // In-memory store for NPC data

class NPCProfile {
    constructor(npcId, name, interests = [], personalityTraits = {}, dialogueStyle = "friendly", baseRelationshipFactors = {}) {
        if (npcs[npcId]) {
            throw new Error(`NPC with ID ${npcId} already exists.`);
        }
        this.npcId = npcId;
        this.name = name;
        this.interests = new Set(interests); // e.g., ["hiking", "coding", "jazz"]
        this.personalityTraits = personalityTraits; // e.g., { "patience": 9, "shyness": 6, "wit": 7 }
        this.dialogueStyle = dialogueStyle; // e.g., "friendly", "sarcastic", "shy", "formal"
        // Base factors influencing how relationship score changes with this NPC
        this.baseRelationshipFactors = { // How this NPC reacts to certain player actions/traits
            likesInterestsInCommon: baseRelationshipFactors.likesInterestsInCommon || 2, // Points per common interest
            prefersCompliments: baseRelationshipFactors.prefersCompliments || true,
            dislikesRudeness: baseRelationshipFactors.dislikesRudeness || true,
            giftPreferences: baseRelationshipFactors.giftPreferences || {} // e.g., { "rose_nft": 10, "book_common": 2 }
        };
        // NPCs don't store player relationships directly; PlayerProfile stores its relationship with each NPC.

        npcs[npcId] = this;
        console.log(`NPC profile created for ${name} (ID: ${npcId})`);
    }

    static getNPC(npcId) {
        return npcs[npcId];
    }

    static initializeNPC(npcId, name, interests, personalityTraits, dialogueStyle, baseRelationshipFactors) {
        if (!npcs[npcId]) {
            return new NPCProfile(npcId, name, interests, personalityTraits, dialogueStyle, baseRelationshipFactors);
        }
        return npcs[npcId];
    }

    hasInterest(interest) {
        return this.interests.has(interest.toLowerCase());
    }

    getGiftPreference(itemId) {
        return this.baseRelationshipFactors.giftPreferences[itemId] || 0;
    }

    viewProfile() {
        return {
            npcId: this.npcId,
            name: this.name,
            interests: Array.from(this.interests),
            personalityTraits: this.personalityTraits,
            dialogueStyle: this.dialogueStyle,
            relationshipFactors: this.baseRelationshipFactors
        };
    }
}

module.exports = NPCProfile;

// Example Usage (conceptual)
/*
NPCProfile.initializeNPC("npc_elara", "Elara", ["astronomy", "poetry"], { "intellect": 8, "dreamy": 7 }, "thoughtful", {
    giftPreferences: { "star_chart_nft": 15, "poem_book": 5 }
});
const npcElara = NPCProfile.getNPC("npc_elara");
if (npcElara) {
    console.log(npcElara.viewProfile());
}
*/
