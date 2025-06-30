using UnityEngine;
using UnityEngine.Networking; // For UnityWebRequest
using System.Collections;
using System.Text; // For Encoding

// --- Data Structures for Server Communication ---
[System.Serializable]
public class MintRequestPayload
{
    public string playerAuthToken;
    public string playerWalletAddress;
    public string achievementId; // e.g., "DefeatedWorldBossX"
    public string itemIdentifier; // e.g., "LegendarySwordOfShadows"
    // Add any other necessary data, like monster ID defeated, dungeon ID cleared, etc.
}

[System.Serializable]
public class MintResponse
{
    public bool success;
    public string message;
    public string transactionHash;
    public string tokenId;
}

public class ServerComms : MonoBehaviour
{
    private string backendApiUrl = "https://your-game-backend.com/api"; // Replace with actual backend URL

    // Public method to be called by game logic
    public void RequestNftMint(string achievementId, string itemIdentifier)
    {
        StartCoroutine(SendNftMintRequest(achievementId, itemIdentifier));
    }

    private IEnumerator SendNftMintRequest(string achievementId, string itemIdentifier)
    {
        string authToken = ""; // Retrieve actual auth token (e.g. from a player login system)
        string playerWallet = ""; // Retrieve player's linked wallet address

        // --- Authentication and Wallet Retrieval ---
        // This is highly dependent on your auth system (e.g., Firebase Auth, custom login)
        // and how you've linked player accounts to their crypto wallets.
        // For this example, using placeholder retrievals.
        // In a real game, these would be securely obtained.
        PlayerAuthenticationSystem authSystem = GetComponent<PlayerAuthenticationSystem>(); // Hypothetical
        if (authSystem != null && authSystem.IsLoggedIn()) {
            authToken = authSystem.GetAuthToken();
            playerWallet = authSystem.GetLinkedWalletAddress();
        } else {
            Debug.LogError("Player not authenticated. Cannot mint NFT.");
            yield break;
        }

        if (string.IsNullOrEmpty(playerWallet)) {
            Debug.LogError("Player wallet address not found. Cannot mint NFT.");
            yield break;
        }
        // --- End Auth/Wallet Placeholder ---


        string endpoint = $"{backendApiUrl}/mintItem";

        MintRequestPayload payload = new MintRequestPayload
        {
            playerAuthToken = authToken,
            playerWalletAddress = playerWallet,
            achievementId = achievementId,
            itemIdentifier = itemIdentifier
        };
        string jsonPayload = JsonUtility.ToJson(payload);
        byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonPayload);

        using (UnityWebRequest request = new UnityWebRequest(endpoint, "POST"))
        {
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            // Potentially add Authorization header if your auth token is a bearer token
            // request.SetRequestHeader("Authorization", $"Bearer {authToken}");

            Debug.Log($"Sending NFT Mint Request to {endpoint}: {jsonPayload}");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log("NFT Mint Request Successful. Response: " + request.downloadHandler.text);
                MintResponse response = JsonUtility.FromJson<MintResponse>(request.downloadHandler.text);

                if (response != null && response.success)
                {
                    Debug.Log($"NFT Minted! TxHash: {response.transactionHash}, TokenID: {response.tokenId}. Message: {response.message}");
                    // Trigger in-game event, update UI, show item to player, etc.
                    // e.g., UIManager.ShowNftReceivedPopup(itemIdentifier, response.tokenId);
                }
                else
                {
                    Debug.LogError($"NFT Minting failed on server: {response?.message ?? "Unknown error"}");
                }
            }
            else
            {
                Debug.LogError($"NFT Mint Request Failed. Error: {request.error}. Response Code: {request.responseCode}");
                if (!string.IsNullOrEmpty(request.downloadHandler.text)) {
                    Debug.LogError("Server response: " + request.downloadHandler.text);
                }
            }
        }
    }
}

// Hypothetical PlayerAuthenticationSystem for context
public class PlayerAuthenticationSystem : MonoBehaviour {
    private bool _isLoggedIn = false; // Example state
    private string _authToken = "dummy_auth_token_example";
    private string _walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

    public bool IsLoggedIn() { /* Check login status */ return _isLoggedIn; }
    public string GetAuthToken() { /* Get session token */ return _isLoggedIn ? _authToken : null; }
    public string GetLinkedWalletAddress() { /* Get linked wallet */ return _isLoggedIn ? _walletAddress : null; }
    public void SimulateLogin() { _isLoggedIn = true; Debug.Log("Player Logged In (Simulated)"); }
    void Start() { SimulateLogin(); } // Auto-login for example
}
