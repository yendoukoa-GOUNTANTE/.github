// LoveChatGame/core_modules/ai/DialogueSystem.js

/**
 * Conceptual AI-Powered Dialogue System.
 * This is a placeholder and would be replaced with a more sophisticated AI/NLP solution.
 */
const NPCProfile = require('../NPCProfile'); // Used to get NPC personality/style
const PlayerProfile = require('../PlayerProfile'); // Used to get player context
const RelationshipLogic = require('../../game_logic/RelationshipLogic'); // Used for relationship milestones

class DialogueSystem {
    constructor() {
        // In a real system, this might load language models, dialogue trees, etc.
        console.log("DialogueSystem initialized (conceptual).");
    }

    /**
     * Generates an NPC response based on player input, NPC profile, and relationship status.
     * This is a very basic mock. A real system would use NLP and generative AI.
     * @param {string} playerId
     * @param {string} npcId
     * @param {string} playerInput
     * @returns {Promise<string>} - The NPC's response.
     */
    async getNPCResponse(playerId, npcId, playerInput) {
        const player = PlayerProfile.getPlayer(playerId);
        const npc = NPCProfile.getNPC(npcId);

        if (!player || !npc) {
            return "Error: Character not found.";
        }

        const relationship = player.getRelationshipWith(npcId);
        playerInput = playerInput.toLowerCase();
        let baseResponse = "";
        let personalityFlavor = "";

        // Simulate delay of an AI service
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));

        // 1. Basic keyword/intent recognition
        if (playerInput.includes("hello") || playerInput.includes("hi") || playerInput.includes("hey")) {
            baseResponse = `Hello ${player.name}.`;
            if (npc.hasDescriptivePersonalityTag("extroverted")) {
                baseResponse = `Hey ${player.name}! Great to see you!`;
            } else if (npc.hasDescriptivePersonalityTag("introverted") && relationship.score < RelationshipLogic.milestones.friend_budding) {
                baseResponse = `Oh, hi ${player.name}.`;
            }

            if (npc.hasDescriptivePersonalityTag("sarcastic") && relationship.score < RelationshipLogic.milestones.friend) {
                personalityFlavor = " What brings your esteemed self to my humble presence?";
            } else if (relationship.score > RelationshipLogic.milestones.friend_budding) {
                personalityFlavor = " How are you doing today?";
            } else if (npc.hasDescriptivePersonalityTag("analytical")) {
                personalityFlavor = " What is the purpose of this interaction?";
            }

        } else if (playerInput.includes("how are you")) {
            if (npc.hasDescriptivePersonalityTag("optimistic")) {
                baseResponse = "I'm feeling fantastic! The world is full of wonders today.";
            } else if (npc.hasDescriptivePersonalityTag("pessimistic")) {
                baseResponse = "Oh, you know... another day, another series of minor disappointments. But I'm managing.";
            } else if (npc.hasDescriptivePersonalityTag("jaded")) {
                baseResponse = "Surviving. That's about the best one can hope for, right?";
            } else if (npc.hasDescriptivePersonalityTag("laid_back")) {
                baseResponse = "Pretty chill, all things considered.";
            } else {
                baseResponse = "I'm doing alright, thanks for asking!";
            }
            personalityFlavor = ` And you, ${player.name}?`;

        } else if (npc.interests.some(interest => playerInput.includes(interest))) {
            const commonInterest = Array.from(npc.interests).find(interest => playerInput.includes(interest));
            baseResponse = `Ah, ${commonInterest}!`;
            if (npc.hasDescriptivePersonalityTag("bookworm") && (commonInterest === "poetry" || commonInterest === "philosophy" || commonInterest === "history")) {
                personalityFlavor = ` An excellent topic. I was just reading about that.`;
            } else if (npc.hasDescriptivePersonalityTag("creative")) {
                personalityFlavor = ` I find ${commonInterest} so inspiring, don't you?`;
            } else if (npc.hasDescriptivePersonalityTag("analytical")) {
                personalityFlavor = ` What specific aspect of ${commonInterest} interests you the most?`;
            } else if (npc.hasDescriptivePersonalityTag("adventurous") && (commonInterest === "skateboarding" || commonInterest === "travel")) {
                personalityFlavor = ` Yeah! ${commonInterest} is awesome. Ever tried that crazy spot downtown?`;
            }
            else {
                personalityFlavor = ` I enjoy ${commonInterest} too.`;
            }
            if (relationship.score < RelationshipLogic.milestones.friend_budding && npc.hasDescriptivePersonalityTag("introverted")) {
                 baseResponse = `You like ${commonInterest}?`;
                 personalityFlavor = ` That's... neat.`;
            }
        } else if (playerInput.includes("gift") || playerInput.includes("for you")) {
            baseResponse = `A gift, ${player.name}?`;
            if (npc.hasDescriptivePersonalityTag("naive")) {
                personalityFlavor = " For me? Oh, wow! You shouldn't have!";
            } else if (npc.hasDescriptivePersonalityTag("jaded")) {
                personalityFlavor = " Trying to buy my affection, are we? Let's see it then.";
            } else if (npc.hasDescriptivePersonalityTag("sarcastic")){
                personalityFlavor = " Oh, you remembered my birthday? It's not my birthday. But fine, I'll take it.";
            } else if (npc.hasDescriptivePersonalityTag("appreciative")) {
                personalityFlavor = " That's so kind of you to think of me!";
            }
            else {
                personalityFlavor = " That's very thoughtful of you.";
            }
            // Further refinement if a specific item is mentioned in the gift context
            // This part_plan is tricky with pure keyword spotting and would be better if "giving an item" is a distinct game action.
            // For now, we assume the dialogue follows an actual "give <item>" command handled in main_game_loop.
            // The main_game_loop would then call a function here to get a reaction *after* the gift is processed by RelationshipLogic.
            // Let's add a new function for specific gift reactions.

        } else if (playerInput.includes("love") && relationship.score > RelationshipLogic.milestones.dating_potential) {
            baseResponse = `Oh, ${player.name}...`;
            if (npc.hasDescriptivePersonalityTag("dreamy") && npc.hasDescriptivePersonalityTag("optimistic")) {
                personalityFlavor = " My heart just soared! I feel it too, so deeply.";
            } else if (npc.hasDescriptivePersonalityTag("sarcastic") && npc.dialogueStyle === "sarcastic_affectionate") {
                 personalityFlavor = " Took you long enough to figure out I'm amazing. Just kidding... mostly. I love you too, you goof.";
            } else if (npc.hasDescriptivePersonalityTag("jaded") && relationship.score > RelationshipLogic.milestones.committed) {
                personalityFlavor = " Heh. Against my better judgment, I think I love you too, kid.";
            }
            else {
                personalityFlavor = " That means a lot to me. I feel something very special for you too.";
            }
        } else if (playerInput.includes("love") && relationship.score <= RelationshipLogic.milestones.friend) {
            baseResponse = `Whoa there, ${player.name}!`;
            if (npc.hasDescriptivePersonalityTag("laid_back")) {
                personalityFlavor = " That's a big word! Let's just keep enjoying our time, yeah?";
            } else if (npc.hasDescriptivePersonalityTag("analytical")) {
                personalityFlavor = " 'Love' is a complex emotion often confused with infatuation. Are you certain of your parameters?";
            } else if (npc.hasDescriptivePersonalityTag("sarcastic")) {
                personalityFlavor = " Love? Already? My, my, someone's eager. Or easily impressed.";
            }
             else {
                personalityFlavor = " Isn't it a bit early for such strong words?";
            }
        } else if (playerInput.includes("future") || playerInput.includes("plans")) {
            if (npc.hasDescriptivePersonalityTag("ambitious")) {
                baseResponse = "Ah, the future! I have big plans, you know.";
                personalityFlavor = " Always aiming higher. What about your ambitions?";
            } else if (npc.hasDescriptivePersonalityTag("laid_back")) {
                baseResponse = "Future, plans... eh, I mostly go with the flow.";
                personalityFlavor = " Too much planning stresses me out. Today is good, right?";
            } else if (npc.hasDescriptivePersonalityTag("pessimistic")) {
                baseResponse = "The future? Hopefully less bleak than the present, but I wouldn't bet on it.";
            } else if (npc.hasDescriptivePersonalityTag("optimistic")) {
                baseResponse = "The future is bright! I'm excited for what's next.";
                personalityFlavor = " Got any exciting plans yourself?";
            }
            else {
                baseResponse = "Thinking about the future, are we?";
            }
        } else if (playerInput.includes("movie date") || playerInput.includes("see a film") || playerInput.includes("watch a movie")) {
            baseResponse = `A movie date, ${player.name}?`;
            if (relationship.score < RelationshipLogic.milestones.crush_developing) {
                if (npc.hasDescriptivePersonalityTag("polite") || npc.hasDescriptivePersonalityTag("shy")) {
                    personalityFlavor = " That's a nice idea, but maybe when we know each other a bit better?";
                } else if (npc.hasDescriptivePersonalityTag("sarcastic")) {
                    personalityFlavor = " A movie? With me? Aren't we moving fast? Or are you just out of other ideas?";
                } else {
                    personalityFlavor = " I'm not sure I'm ready for that yet, but thanks for asking.";
                }
            } else { // Relationship score is high enough
                if (npc.hasDescriptivePersonalityTag("extroverted") || npc.hasDescriptivePersonalityTag("adventurous")) {
                    personalityFlavor = " Sounds like fun! I'm in! What should we watch?";
                } else if (npc.hasDescriptivePersonalityTag("introverted") && !npc.hasDescriptivePersonalityTag("homebody")) {
                    personalityFlavor = " A movie... that could be nice and quiet. Okay, I'd like that.";
                } else if (npc.hasDescriptivePersonalityTag("homebody")) {
                    personalityFlavor = " A movie is nice, but can we watch it at my virtual place instead of the big cinema? Just kidding... or am I? Sure, let's go.";
                } else if (npc.hasDescriptivePersonalityTag("analytical")) {
                    personalityFlavor = " A film exposition could be an intriguing shared experience. Which genre are you proposing?";
                }
                else {
                    personalityFlavor = " Yes, I'd like that very much, " + player.name + ".";
                }
            }
        }
        else {
            // Default responses based on general style if no keywords hit strongly
            if (npc.hasDescriptivePersonalityTag("analytical")) {
                baseResponse = "That's an interesting statement. Can you elaborate on your reasoning?";
            } else if (npc.hasDescriptivePersonalityTag("introverted") && Math.random() < 0.6) {
                baseResponse = "Hmm...";
                personalityFlavor = (Math.random() < 0.5) ? " I'll need to think about that." : " Okay.";
            } else if (npc.hasDescriptivePersonalityTag("extroverted")) {
                baseResponse = "Totally! So, what else is new and exciting?";
                 if (Math.random() < 0.3) personalityFlavor = " Spill the tea!";
            } else if (npc.hasDescriptivePersonalityTag("creative")) {
                baseResponse = "That makes me think of a song/poem/idea...";
            }
            else {
                 switch (npc.dialogueStyle) {
                    case "thoughtful": baseResponse = "That gives me something to ponder."; break;
                    case "shy": baseResponse = "Um... I'm not quite sure how to respond to that."; break;
                    case "sarcastic": baseResponse = "Fascinating. Truly groundbreaking stuff you're sharing there."; break;
                    case "formal": baseResponse = "Understood. Is there anything further?"; break;
                    default: baseResponse = "I see.";
                }
            }
            if (!personalityFlavor && Math.random() < 0.4) personalityFlavor = ` What are your thoughts on it, ${player.name}?`;
        }

        const finalResponse = (baseResponse + " " + personalityFlavor).trim();

        // Add to chat history
        player.addChatMessage(npcId, player.name, playerInput);
        player.addChatMessage(npcId, npc.name, finalResponse); // Use finalResponse here

        return finalResponse; // And here
    }
}

module.exports = new DialogueSystem(); // Singleton instance

    /**
     * Generates a more specific NPC reaction to a gift they just received.
     * Called *after* RelationshipLogic has processed the gift.
     * @param {string} playerId
     * @param {string} npcId
     * @param {object} giftedItem - The item object that was given.
     * @param {number} giftPreferenceScore - The score NPC assigned to this gift.
     * @returns {Promise<string>} - The NPC's thank you/reaction message.
     */
    async getGiftReactionResponse(playerId, npcId, giftedItem, giftPreferenceScore) {
        const player = PlayerProfile.getPlayer(playerId);
        const npc = NPCProfile.getNPC(npcId);
        if (!player || !npc || !giftedItem) return "Oh... thanks.";

        let reaction = "";
        const itemName = giftedItem.itemId;
        const itemType = giftedItem.type;
        const itemMeta = giftedItem.metadata || {};

        await new Promise(resolve => setTimeout(resolve, 200)); // Quick reaction

        if (giftPreferenceScore > 15) { // Very liked gift
            reaction = `Wow, ${player.name}! This ${itemName.replace(/_nft|_common|_rare/g, '')} is amazing! `;
            if (npc.hasDescriptivePersonalityTag("extroverted")) reaction += "I absolutely LOVE it! You're the best! ";
            else if (npc.hasDescriptivePersonalityTag("creative") && itemType === "ArtPieceNFT") reaction += `The ${itemMeta.style || 'style'} is just perfect. `;
            else if (npc.hasDescriptivePersonalityTag("bookworm") && itemType === "PersonalizedCreationNFT") reaction += `A ${itemMeta.title || 'creation'} just for me? I'm speechless! `;
            else reaction += "Thank you so much, this means a lot! ";
        } else if (giftPreferenceScore > 5) { // Liked gift
            reaction = `Oh, a ${itemName.replace(/_nft|_common|_rare/g, '')}! That's really nice, ${player.name}. `;
            if (npc.hasDescriptivePersonalityTag("appreciative")) reaction += "I really appreciate this. ";
            else if (npc.hasDescriptivePersonalityTag("introverted")) reaction += "It's... lovely. Thank you. ";
            else reaction += "Thanks! ";
            if (itemType === "MusicTrackNFT" && npc.baseRelationshipFactors.giftPreferences.likedGenres.includes(itemMeta.genre)) {
                reaction += `I do enjoy ${itemMeta.genre} music. `;
            }
        } else if (giftPreferenceScore >= 0) { // Neutral or slightly liked
            reaction = `Thanks for the ${itemName.replace(/_nft|_common|_rare/g, '')}, ${player.name}. `;
            if (npc.hasDescriptivePersonalityTag("polite") || npc.dialogueStyle === "formal") reaction += "That was considerate of you. ";
            else if (npc.hasDescriptivePersonalityTag("jaded")) reaction = `A ${itemName.replace(/_nft|_common|_rare/g, '')}, huh? Alright. Thanks, I guess. `;
            else reaction += "It's the thought that counts. ";
        } else { // Disliked gift
            reaction = `Um, thanks for the ${itemName.replace(/_nft|_common|_rare/g, '')}, ${player.name}. `;
            if (npc.hasDescriptivePersonalityTag("sarcastic")) reaction = `Oh, a ${itemName.replace(/_nft|_common|_rare/g, '')}. You really know how to spoil someone... not. `;
            else if (npc.hasDescriptivePersonalityTag("pessimistic")) reaction += "Well, it's... an item. ";
            else if (!npc.hasDescriptivePersonalityTag("rude")) reaction += "I'll... find a place for it. "; // Trying to be polite despite dislike
            else reaction = `I... don't really like this, ${player.name}. But thanks for trying.`;
        }

        // Add personality-specific comments about the item itself
        if (itemType === "WearableAccessoryNFT" && npc.hasDescriptivePersonalityTag("stylish")) {
            if (giftPreferenceScore > 5 && itemMeta.style_tag && npc.baseRelationshipFactors.giftPreferences.likedStyles.includes(itemMeta.style_tag)) {
                reaction += `This ${itemMeta.style_tag} ${itemMeta.slot || 'accessory'} is totally my vibe! `;
            } else if (giftPreferenceScore < 0) {
                reaction += `This ${itemMeta.style_tag || ''} style isn't quite me, though. `;
            }
        }
        if (itemMeta.rarity && (itemMeta.rarity === "legendary" || itemMeta.rarity === "epic" || itemMeta.rarity === "unique_personal_creation") && giftPreferenceScore > 10) {
            if (npc.hasDescriptivePersonalityTag("collector") || npc.hasDescriptivePersonalityTag("appreciative")) {
                 reaction += `And it's so ${itemMeta.rarity}! That makes it extra special!`;
            }
        }


        const finalReaction = reaction.trim();
        player.addChatMessage(npcId, npc.name, finalReaction);
        return finalReaction;
    }

    /**
     * Generates contextual dialogue during/after a shared activity like a movie.
     * @param {string} npcId
     * @param {string} activityType - e.g., "virtual_movie_date"
     * @param {string} eventPoint - e.g., "during_movie_comment", "after_movie_liked", "after_movie_disliked"
     * @param {object} activityDetails - e.g., { chosenMovie: "Galaxy Explorers 3" }
     * @returns {Promise<string>}
     */
    async getActivityContextualDialogue(npcId, activityType, eventPoint, activityDetails = {}) {
        const npc = NPCProfile.getNPC(npcId);
        if (!npc) return "";

        let dialogue = "";
        await new Promise(resolve => setTimeout(resolve, 150)); // Quick response

        if (activityType === "virtual_movie_date") {
            const movie = activityDetails.chosenMovie || "the movie";
            if (eventPoint === "during_movie_comment") {
                if (npc.hasDescriptivePersonalityTag("sarcastic")) dialogue = `(Whispering) This part_plan is SO predictable... or is it?`;
                else if (npc.hasDescriptivePersonalityTag("analytical")) dialogue = `(Whispering) Interesting plot device they used there.`;
                else if (npc.hasDescriptivePersonalityTag("extroverted")) dialogue = `(Whispering) Whoa, did you see that?!`;
                else if (npc.hasDescriptivePersonalityTag("dreamy")) dialogue = `(Sighs contentedly during a romantic scene in '${movie}')`;
                else dialogue = `(Quietly enjoys '${movie}')`;
            } else if (eventPoint === "after_movie_liked") {
                dialogue = `That was a great movie! I really enjoyed '${movie}'. Thanks for suggesting it!`;
                if (npc.hasDescriptivePersonalityTag("bookworm") && movie.includes("Algorithm")) dialogue = `'${movie}' really made me think. We should discuss its themes.`;
            } else if (eventPoint === "after_movie_disliked") {
                dialogue = `Well, '${movie}' wasn't exactly my favorite.`;
                if (npc.hasDescriptivePersonalityTag("pessimistic")) dialogue += ` But then again, few things are.`;
                else if (npc.hasDescriptivePersonalityTag("polite")) dialogue += ` But I appreciate you taking me!`;
                else dialogue += ` Maybe we can pick something different next time?`;
            } else if (eventPoint === "after_movie_neutral") {
                 dialogue = `'${movie}' was alright. It passed the time.`;
            }
        }
        // player.addChatMessage(npcId, npc.name, dialogue); // Player ID needed for this
        return dialogue;
    }
}

module.exports = new DialogueSystem(); // Singleton instance

// Example Usage (conceptual)
/*
async function testDialogueAndGift() {
    PlayerProfile.initializePlayer("player1", "Alex");
    NPCProfile.initializeNPC("npc_elara", "Elara", ["astronomy", "art"],
        { intellect: 8 },
        ["dreamy", "appreciative", "bookworm"],
        "thoughtful",
        { giftPreferences: {
            likedTypes: ["ArtPieceNFT", "PersonalizedCreationNFT"],
            likedStyles: ["impressionistic"],
            specificItems: {"star_chart_nft": 20}
        }});

    const playerAlex = PlayerProfile.getPlayer("player1");
    const elara = NPCProfile.getNPC("npc_elara");

    // Simulate giving a star chart
    const starChartItem = { itemId: "star_chart_nft", type: "ArtPieceNFT", metadata: { style: "celestial", rarity: "rare", title: "Star Chart" } };
    playerAlex.inventory["star_chart_nft"] = { quantity: 1, ...starChartItem }; // Add to inventory for logic

    const giftScore = elara.getGiftPreferenceValue(starChartItem);
    RelationshipLogic.updateRelationshipScore("player1", "npc_elara", "received_gift", { itemId: "star_chart_nft" });

    const reaction = await DialogueSystem.getGiftReactionResponse("player1", "npc_elara", starChartItem, giftScore);
    console.log(`Elara's gift reaction: "${reaction}"`);

    const genericResponse = await DialogueSystem.getNPCResponse("player1", "npc_elara", "What do you think of space?");
    console.log(`Elara says: "${genericResponse}"`);

    const movieComment = await DialogueSystem.getActivityContextualDialogue("npc_elara", "virtual_movie_date", "during_movie_comment", {chosenMovie: "Galaxy Explorers 3"});
    console.log(`Elara (during movie): ${movieComment}`);
}
// testDialogueAndGift();
*/
