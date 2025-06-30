using UnityEngine;
using System; // For Action delegates

public class PlayerStats : MonoBehaviour
{
    // Core Attributes
    public int strength = 10;
    public int agility = 10;
    public int vitality = 10;
    public int intelligence = 10; // Or Mana/Magic Power

    // Derived Stats
    public int maxHealth { get; private set; }
    public int currentHealth { get; private set; }
    public float attackPower { get; private set; }
    public float defense { get; private set; }
    // Add other derived stats: crit chance, crit damage, mana, etc.

    // Leveling
    public int currentLevel = 1;
    public int currentXP = 0;
    public int xpToNextLevel = 100;
    public int unallocatedStatPoints = 0;

    // Events for UI updates or other systems
    public static event Action OnHealthChanged;
    public static event Action OnXPChanged;
    public static event Action OnLevelUp;
    public static event Action<int> OnStatPointsChanged; // Sends current unallocated points

    void Start()
    {
        RecalculateDerivedStats();
        currentHealth = maxHealth;
        // Load player stats if a save system exists
    }

    private void RecalculateDerivedStats()
    {
        maxHealth = vitality * 10; // Example formula
        attackPower = strength * 2;  // Example formula
        defense = vitality * 0.5f; // Example formula
        // Recalculate other derived stats
    }

    public void AddXP(int amount)
    {
        currentXP += amount;
        Debug.Log($"Gained {amount} XP. Total XP: {currentXP}/{xpToNextLevel}");
        OnXPChanged?.Invoke();

        if (currentXP >= xpToNextLevel)
        {
            LevelUp();
        }
    }

    private void LevelUp()
    {
        currentLevel++;
        currentXP -= xpToNextLevel; // Or currentXP = 0 if you prefer reset
        xpToNextLevel = Mathf.FloorToInt(xpToNextLevel * 1.5f); // Example scaling
        unallocatedStatPoints += 5; // Example: 5 stat points per level

        RecalculateDerivedStats(); // In case base stats affect derived stats directly or new passives unlock
        currentHealth = maxHealth; // Full heal on level up

        Debug.Log($"Leveled Up! Level: {currentLevel}. Stat points to allocate: {unallocatedStatPoints}");
        OnLevelUp?.Invoke();
        OnStatPointsChanged?.Invoke(unallocatedStatPoints);
        OnXPChanged?.Invoke(); // Update XP bar for new threshold
        OnHealthChanged?.Invoke(); // Update health bar
    }

    public bool AllocateStatPoint(string statName, int amount = 1)
    {
        if (unallocatedStatPoints < amount)
        {
            Debug.Log("Not enough unallocated stat points.");
            return false;
        }

        bool statAllocated = true;
        switch (statName.ToLower())
        {
            case "strength":
                strength += amount;
                break;
            case "agility":
                agility += amount;
                break;
            case "vitality":
                vitality += amount;
                break;
            case "intelligence":
                intelligence += amount;
                break;
            default:
                Debug.Log($"Invalid stat name: {statName}");
                statAllocated = false;
                break;
        }

        if (statAllocated)
        {
            unallocatedStatPoints -= amount;
            RecalculateDerivedStats();
            // Potentially restore health if vitality was increased and it affects maxHealth
            currentHealth = Mathf.Min(currentHealth, maxHealth); // Ensure health doesn't exceed new max
            OnHealthChanged?.Invoke();
            OnStatPointsChanged?.Invoke(unallocatedStatPoints);
            Debug.Log($"Allocated {amount} point(s) to {statName}. Remaining points: {unallocatedStatPoints}");
        }
        return statAllocated;
    }

    public void TakeDamage(int damageAmount)
    {
        int actualDamage = Mathf.Max(0, damageAmount - (int)defense); // Simple defense calculation
        currentHealth -= actualDamage;
        currentHealth = Mathf.Max(0, currentHealth); // Cannot go below 0

        Debug.Log($"Player took {actualDamage} damage. Current Health: {currentHealth}/{maxHealth}");
        OnHealthChanged?.Invoke();

        if (currentHealth <= 0)
        {
            Die();
        }
    }

    public void Heal(int healAmount)
    {
        currentHealth += healAmount;
        currentHealth = Mathf.Min(currentHealth, maxHealth); // Cannot exceed max health
        Debug.Log($"Player healed for {healAmount}. Current Health: {currentHealth}/{maxHealth}");
        OnHealthChanged?.Invoke();
    }

    private void Die()
    {
        Debug.Log("Player has died. Game Over or respawn logic here.");
        // Handle player death: respawn, game over screen, etc.
    }

    // TODO: Add methods for skill management, inventory interaction, etc.
    // TODO: Save/Load functionality
}
