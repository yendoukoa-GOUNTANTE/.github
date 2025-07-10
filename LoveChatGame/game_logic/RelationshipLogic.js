// LoveChatGame/game_logic/RelationshipLogic.js

const PlayerProfile = require('../core_modules/PlayerProfile');
const NPCProfile = require('../core_modules/NPCProfile');

class RelationshipLogic {
    constructor() {
        this.milestones = {
            acquaintance: 0,
            friend_budding: 15,
            friend: 30,
            close_friend: 50,
            crush_developing: 70,
            dating_potential: 85, // Player might be able to ask NPC on a date
            dating: 100,
            committed: 150
            // etc.
        };
        console.log("RelationshipLogic initialized.");
    }

    getMilestoneForScore(score) {
        let currentMilestone = "acquaintance";
        for (const milestone in this.milestones) {
            if (score >= this.milestones[milestone]) {
                currentMilestone = milestone;
            } else {
                break; // Milestones should be ordered by score
            }
        }
        return currentMilestone;
    }

    /**
     * Updates the relationship score between a player and an NPC.
     * @param {string} playerId
     * @param {string} npcId
     *   - "positive_dialogue": General positive interaction.
     *   - "negative_dialogue": General negative interaction.
     *   - "shared_interest_discussed": Player discussed a shared interest.
     *   - "received_gift": NPC received a gift from the player.
     *   - "completed_shared_activity": Player and NPC did something together.
     * @param {object} params - Additional parameters, e.g., { itemId: "rose_nft", interestsInCommon: 2 }
     */
    updateRelationshipScore(playerId, npcId, interactionType, params = {}) {
        const player = PlayerProfile.getPlayer(playerId);
        const npc = NPCProfile.getNPC(npcId);

        if (!player || !npc) {
            console.error("Error updating relationship: Player or NPC not found.");
            return;
        }

        const relationship = player.getRelationshipWith(npcId);
        let scoreChange = 0;

        switch (interactionType) {
            case "positive_dialogue":
                scoreChange = 1 + Math.floor(Math.random() * 2); // 1-2 points
                if (npc.personalityTraits.appreciative) scoreChange += 1;
                break;
            case "negative_dialogue":
                scoreChange = -1 - Math.floor(Math.random() * 2); // -1 to -2 points
                if (npc.baseRelationshipFactors.dislikesRudeness) scoreChange -=1;
                break;
            case "shared_interest_discussed":
                const commonInterestsCount = params.interestsInCommon || 0;
                scoreChange = (npc.baseRelationshipFactors.likesInterestsInCommon || 1) * commonInterestsCount;
                if (relationship.score < this.milestones.friend_budding) scoreChange *= 2; // Bigger impact early on
                break;
            case "received_gift":
                const giftValue = npc.getGiftPreference(params.itemId) || 0;
                scoreChange = giftValue;
                if (giftValue > 0 && npc.personalityTraits.grateful) scoreChange += Math.floor(giftValue * 0.2); // Grateful NPCs appreciate more
                if (giftValue < 0) scoreChange *= 2; // Really dislikes gift
                break;
            case "completed_shared_activity":
                scoreChange = params.activityValue || 5; // Default 5 points for an activity
                if (params.activityEnjoyedByNPC) scoreChange += 3;
                break;
            default:
                console.warn(`Unknown interaction type: ${interactionType}`);
                return;
        }

        const oldScore = relationship.score;
        relationship.score += scoreChange;
        if (relationship.score < -20) relationship.score = -20; // Min relationship score cap
        if (relationship.score > 200) relationship.score = 200; // Max relationship score cap (for this example)


        const oldMilestone = relationship.milestone;
        relationship.milestone = this.getMilestoneForScore(relationship.score);

        console.log(`Relationship score for ${player.name} with ${npc.name} changed by ${scoreChange}. New score: ${relationship.score}.`);

        if (relationship.milestone !== oldMilestone) {
            console.log(`${player.name} and ${npc.name} are now: ${relationship.milestone}! (was ${oldMilestone})`);
            // Here you could trigger events, unlock new dialogue, etc.
            // SandboxIntegration.displaySandboxNotification(playerId, `Your relationship with ${npc.name} is now: ${relationship.milestone}!`);
        }
        return relationship;
    }
}

module.exports = new RelationshipLogic(); // Singleton instance

// Example Usage (conceptual)
/*
PlayerProfile.initializePlayer("player1", "Alex", ["gaming", "art"]);
NPCProfile.initializeNPC("npc_elara", "Elara", ["art", "poetry"], {}, "friendly", {
    likesInterestsInCommon: 3,
    giftPreferences: {"art_book_nft": 10}
});

RelationshipLogic.updateRelationshipScore("player1", "npc_elara", "positive_dialogue");
RelationshipLogic.updateRelationshipScore("player1", "npc_elara", "shared_interest_discussed", {interestsInCommon: 1}); // Alex and Elara both like art
RelationshipLogic.updateRelationshipScore("player1", "npc_elara", "received_gift", {itemId: "art_book_nft"});

const playerAlex = PlayerProfile.getPlayer("player1");
console.log(playerAlex.getRelationshipWith("npc_elara"));
*/
