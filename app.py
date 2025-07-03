from flask import Flask, request, jsonify
import uuid # For generating unique game IDs

# Assuming boxing_game_logic.py is in the same directory
import boxing_game_logic as bgl

app = Flask(__name__)

# Simple in-memory store for active game states
# In a production app, this would be a database or a more robust cache
active_games = {}

def serialize_game_state(game_state: bgl.GameState) -> dict:
    """
    Serializes the GameState object (and its nested Fighter objects) into a dictionary
    that can be easily converted to JSON.
    """
    if not game_state:
        return None

    def serialize_fighter(fighter: bgl.Fighter) -> dict:
        if not fighter:
            return None
        return {
            "name": fighter.name.value,
            "hp": fighter.hp,
            "max_hp": fighter.max_hp,
            "stamina": fighter.stamina,
            "max_stamina": fighter.max_stamina,
            "knockdowns_this_round": fighter.knockdowns_this_round,
            "total_knockdowns": fighter.total_knockdowns,
            "current_action": fighter.current_action.value,
            "stats": fighter.stats, # Assuming stats dict is already serializable
            "round_scores": fighter.round_scores
        }

    return {
        "game_id": game_state.game_id if hasattr(game_state, 'game_id') else None, # Will add this attribute
        "match_status": game_state.match_status.value,
        "current_round": game_state.current_round,
        "max_rounds": game_state.max_rounds,
        "round_timer": round(game_state.round_timer, 1),
        "is_round_active": game_state.is_round_active,
        "between_rounds_timer": round(game_state.between_rounds_timer, 1),
        "winner": game_state.winner.value if isinstance(game_state.winner, bgl.FighterName) else game_state.winner, # Handles draw string
        "player": serialize_fighter(game_state.player),
        "opponent": serialize_fighter(game_state.opponent),
        "knockdown_info": {
            "is_knockdown": game_state.knockdown_info["is_knockdown"],
            "fighter_down": game_state.knockdown_info["fighter_down"].value if game_state.knockdown_info["fighter_down"] else None,
            "count": round(game_state.knockdown_info["count"], 1)
        },
        "event_log": game_state.event_log[-10:] # Send last 10 events
    }

@app.route('/game/start', methods=['POST'])
def start_game():
    game_id = str(uuid.uuid4())
    game_state = bgl.initialize_new_game()
    game_state.game_id = game_id # Add game_id to the game_state object itself

    # Start the first round immediately for simplicity in this API
    bgl.start_new_round(game_state)

    active_games[game_id] = game_state

    app.logger.info(f"Game started with ID: {game_id}")
    return jsonify(serialize_game_state(game_state)), 200

@app.route('/game/<game_id>/action', methods=['POST'])
def player_action(game_id):
    game_state = active_games.get(game_id)
    if not game_state:
        return jsonify({"error": "Game not found"}), 404

    if game_state.match_status == bgl.GameStatus.MATCH_OVER:
        return jsonify({"error": "Match is over"}), 400

    action_data = request.json
    if not action_data or "action" not in action_data:
        return jsonify({"error": "Missing action in request body"}), 400

    action_str = action_data["action"]
    try:
        action_type = bgl.ActionType[action_str.upper()]
    except KeyError:
        return jsonify({"error": f"Invalid action: {action_str}"}), 400

    # Use the placeholder function which now queues the action
    # The game_tick will process it.
    # For API, we assume player actions are primary drivers of ticks for now.
    if game_state.is_round_active :
        bgl.queue_player_action_for_tick(action_type)
        # Crucially, we need to run a game tick for the action to be processed
        # and for the AI to potentially react and for timers to update.
        bgl.game_tick(game_state)
    else:
        app.logger.warn(f"Action {action_str} received for game {game_id} but round is not active.")
        # Optionally, still run a game_tick if, for example, it's between rounds to advance that timer
        bgl.game_tick(game_state)


    app.logger.info(f"Action '{action_str}' received for game {game_id}")
    return jsonify(serialize_game_state(game_state)), 200

@app.route('/game/<game_id>/state', methods=['GET'])
def get_game_state(game_id):
    game_state = active_games.get(game_id)
    if not game_state:
        return jsonify({"error": "Game not found"}), 404

    # Optionally, run a game_tick if state is requested to ensure it's fresh,
    # especially if AI can act or timers need to advance independently of player actions.
    # This makes GET /state have a side effect, which is not always ideal REST practice,
    # but common in simple game servers.
    # if game_state.is_round_active or game_state.knockdown_info["is_knockdown"] or game_state.match_status == bgl.GameStatus.BETWEEN_ROUNDS:
    #    bgl.game_tick(game_state)

    app.logger.info(f"State requested for game {game_id}")
    return jsonify(serialize_game_state(game_state)), 200

if __name__ == '__main__':
    # It's good practice to enable logging for development
    import logging
    logging.basicConfig(level=logging.INFO)
    # Make sure PLAYER_ACTION_QUEUE is cleared if app is re-run in some interactive environments
    bgl.PLAYER_ACTION_QUEUE.clear()
    app.run(debug=True, port=5001) # Using port 5001 to avoid conflicts
```

**Self-correction/Notes for `app.py`:**
1.  **Serialization:** Added a `serialize_game_state` function to convert `GameState` and nested `Fighter` objects (including enums) into JSON-friendly dictionaries. This is crucial for `jsonify`.
2.  **Game ID:** Game states are stored in `active_games` dictionary keyed by a `uuid`. The `game_id` is also added as an attribute to the `game_state` object itself for convenience in `serialize_game_state`.
3.  **Starting the Game:** The `/game/start` endpoint now also calls `bgl.start_new_round(game_state)` because a game usually starts directly into round 1.
4.  **`game_tick` in Action Endpoint:** It's important that after a player action is received and queued, `bgl.game_tick(game_state)` is called. This processes the queued player action, allows the AI to take a turn, updates timers, stamina, etc. Without this, the game state wouldn't change immediately after a player's action.
5.  **`game_tick` in State Endpoint (Commented Out):** Considered adding `game_tick` to `GET /state` for auto-updating state, but decided against it for now to keep GET requests simpler and without side-effects. The primary driver of state change will be player actions. A polling front-end might eventually need this or a WebSocket connection.
6.  **Logging:** Added basic Flask app logging (`app.logger.info`).
7.  **Port:** Changed default port to `5001` to avoid common conflicts.
8.  **PLAYER_ACTION_QUEUE:** Added a clear for `bgl.PLAYER_ACTION_QUEUE` in `if __name__ == '__main__':` just in case of interactive re-runs where the global list might persist.

This `app.py` provides the basic API endpoints. Next, we'll create the HTML, CSS, and JS to interact with it.
