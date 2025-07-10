// LoveChatGame/core_modules/NPCProfile.js

/**
 * Manages NPC (Non-Player Character) profiles.
 * Uses an in-memory store for simplicity.
 */

const npcs = {}; // In-memory store for NPC data

class NPCProfile {
    /**
     * Creates an NPC profile.
     * @param {string} npcId - Unique ID for the NPC.
     * @param {string} name - NPC's name.
     * @param {string[]} interests - Array of interests (e.g., ["hiking", "coding"]).
     * @param {object} corePersonality - Core numerical traits (e.g., { "patience": 9, "wit": 7 }).
     * @param {string[]} descriptivePersonalityTags - Array of descriptive tags (e.g., ["optimistic", "bookworm"]).
     * @param {string} dialogueStyle - General style of dialogue (e.g., "friendly", "sarcastic").
     * @param {object} baseRelationshipFactors - Factors influencing relationship changes.
     */
    constructor(npcId, name, interests = [], corePersonality = {}, descriptivePersonalityTags = [], dialogueStyle = "friendly", baseRelationshipFactors = {}) {
        if (npcs[npcId]) {
            throw new Error(`NPC with ID ${npcId} already exists.`);
        }
        this.npcId = npcId;
        this.name = name;
        this.interests = new Set(interests.map(i => i.toLowerCase()));
        this.corePersonality = corePersonality; // e.g., { "patience": 9, "shyness": 6, "wit": 7 }
        this.descriptivePersonalityTags = new Set(descriptivePersonalityTags.map(t => t.toLowerCase())); // e.g., ["optimistic", "introverted", "bookworm"]
        this.dialogueStyle = dialogueStyle; // e.g., "friendly", "sarcastic", "shy", "formal"

        this.baseRelationshipFactors = {
            likesInterestsInCommon: baseRelationshipFactors.likesInterestsInCommon || 2,
            prefersCompliments: baseRelationshipFactors.prefersCompliments !== undefined ? baseRelationshipFactors.prefersCompliments : true,
            dislikesRudeness: baseRelationshipFactors.dislikesRudeness !== undefined ? baseRelationshipFactors.dislikesRudeness : true,
            giftPreferences: baseRelationshipFactors.giftPreferences || {}
        };

        npcs[npcId] = this;
        console.log(`NPC profile created for ${name} (ID: ${npcId}) with tags: [${Array.from(this.descriptivePersonalityTags).join(', ')}]`);
    }

    static getNPC(npcId) {
        return npcs[npcId];
    }

    static initializeNPC(npcId, name, interests, corePersonality, descriptivePersonalityTags, dialogueStyle, baseRelationshipFactors) {
        if (!npcs[npcId]) {
            return new NPCProfile(npcId, name, interests, corePersonality, descriptivePersonalityTags, dialogueStyle, baseRelationshipFactors);
        }
        return npcs[npcId];
    }

    hasDescriptivePersonalityTag(tag) {
        return this.descriptivePersonalityTags.has(tag.toLowerCase());
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
            corePersonality: this.corePersonality,
            descriptivePersonalityTags: Array.from(this.descriptivePersonalityTags),
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
