using UnityEngine;
using System.Collections.Generic;

public class ShadowExtractionManager : MonoBehaviour
{
    public PlayerStats playerStats; // Reference to the player's stats
    public GameObject shadowSoldierPrefab; // Prefab for a basic shadow soldier
    public float baseExtractionChance = 0.3f; // Base chance (30%)
    public int maxPlayerShadows = 5; // Initial limit, can be upgraded

    private List<ShadowController> activeShadows = new List<ShadowController>();

    public static event System.Action<int, int> OnActiveShadowsChanged; // current, max

    void Start()
    {
        if (playerStats == null)
            playerStats = FindObjectOfType<PlayerStats>(); // Assuming one PlayerStats in scene

        // Subscribe to an event that signals an eligible enemy's death
        // e.g., EnemyHealth.OnEnemyDefeatedWithExtractionChance += AttemptExtraction;
        UpdateShadowCountUI();
    }

    // This method would be called when an extractable enemy is defeated
    public void AttemptExtraction(Transform enemyTransform, /* MonsterStats originalMonsterStats, */ float monsterPowerLevel)
    {
        if (activeShadows.Count >= maxPlayerShadows)
        {
            Debug.Log("Cannot extract shadow: Shadow limit reached.");
            // Optionally, allow replacing an existing shadow
            return;
        }

        // Calculate success chance
        // More complex: factor in player Int, level diff, monster power, etc.
        float successChance = baseExtractionChance + (playerStats.intelligence * 0.01f) - (monsterPowerLevel * 0.05f);
        successChance = Mathf.Clamp01(successChance);

        if (Random.value <= successChance)
        {
            Debug.Log("<color=purple>System: Extraction Successful! 'Arise.'</color>");
            SummonShadow(enemyTransform.position, enemyTransform.rotation /*, originalMonsterStats */);
        }
        else
        {
            Debug.Log("<color=red>System: Extraction Failed.</color>");
        }
    }

    void SummonShadow(Vector3 position, Quaternion rotation /*, MonsterStats originalStats */)
    {
        GameObject shadowGO = Instantiate(shadowSoldierPrefab, position, rotation);
        ShadowController shadowController = shadowGO.GetComponent<ShadowController>();

        if (shadowController != null)
        {
            shadowController.Initialize(playerStats.transform /*, originalStats */, playerStats.currentLevel);
            activeShadows.Add(shadowController);
            // PlayerStats.OnShadowAdded?.Invoke(shadowController); // Notify other systems
            Debug.Log($"Summoned Shadow: {shadowGO.name}. Total shadows: {activeShadows.Count}/{maxPlayerShadows}");
            UpdateShadowCountUI();
        }
        else
        {
            Debug.LogError("Shadow prefab is missing ShadowController script!");
            Destroy(shadowGO);
        }
    }

    public void UnsummonShadow(ShadowController shadowToRemove)
    {
        if (activeShadows.Contains(shadowToRemove))
        {
            activeShadows.Remove(shadowToRemove);
            Destroy(shadowToRemove.gameObject);
            Debug.Log($"Unsummoned Shadow. Total shadows: {activeShadows.Count}/{maxPlayerShadows}");
            UpdateShadowCountUI();
        }
    }

    public void UnsummonAllShadows()
    {
        for (int i = activeShadows.Count - 1; i >= 0; i--)
        {
            Destroy(activeShadows[i].gameObject);
        }
        activeShadows.Clear();
        UpdateShadowCountUI();
        Debug.Log("All shadows unsummoned.");
    }


    public List<ShadowController> GetActiveShadows()
    {
        return activeShadows;
    }

    // Call this when player levels up skills related to shadow capacity
    public void IncreaseMaxShadows(int amount)
    {
        maxPlayerShadows += amount;
        UpdateShadowCountUI();
    }

    private void UpdateShadowCountUI()
    {
        OnActiveShadowsChanged?.Invoke(activeShadows.Count, maxPlayerShadows);
    }

    // Example: Call this from an enemy's death script
    // public void OnEnemyDefeated(EnemyHealth enemy) {
    //     if (enemy.isExtractable && enemy.isBoss) { // Or some other criteria
    //         AttemptExtraction(enemy.transform, enemy.powerLevel);
    //     }
    // }
}
