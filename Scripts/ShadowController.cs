using UnityEngine;
using UnityEngine.AI;

public class ShadowController : MonoBehaviour
{
    public enum ShadowState
    {
        Idle,
        Following,
        Attacking,
        Returning
    }

    public ShadowState currentState = ShadowState.Following;
    private NavMeshAgent navMeshAgent;
    private Transform playerTransform; // The Shadow Monarch (player)
    private Transform currentTarget;

    public float attackRange = 2f;
    public float followDistance = 3f; // How close to stay to the player
    public float detectionRadius = 8f; // Radius to auto-acquire targets
    public int shadowStrength; // Scales with player level or individual upgrades

    // Basic stats (could be inherited from original monster or set by type)
    public float moveSpeed = 3.5f;
    // public int attackPower = 10;
    // public float attackCooldown = 1.5f;
    // private float lastAttackTime;

    void Awake()
    {
        navMeshAgent = GetComponent<NavMeshAgent>();
        if (navMeshAgent == null)
        {
            Debug.LogError("ShadowController requires a NavMeshAgent component.", this);
            enabled = false;
            return;
        }
        navMeshAgent.speed = moveSpeed;
        navMeshAgent.stoppingDistance = followDistance * 0.8f; // Stop a bit before exact follow distance when following player
    }

    public void Initialize(Transform monarchTransform, /* MonsterStats originalStats, */ int monarchLevel)
    {
        playerTransform = monarchTransform;
        // Scale shadowStrength based on monarchLevel or originalStats
        // Example: shadowStrength = monarchLevel * 5 + (originalStats != null ? originalStats.basePower / 2 : 10);
        shadowStrength = monarchLevel * 5 + 10; // Simplified
        gameObject.name = "Shadow Soldier (Lvl " + monarchLevel + ")";
        // Set other initial properties based on original monster if applicable
    }

    void Update()
    {
        if (playerTransform == null)
        {
            // Monarch is gone, perhaps self-destruct or stand still
            navMeshAgent.isStopped = true;
            currentState = ShadowState.Idle;
            return;
        }

        switch (currentState)
        {
            case ShadowState.Idle:
                // Do nothing, or simple idle animation
                LookForTargets(); // Could still look for targets if aggressive
                break;
            case ShadowState.Following:
                FollowPlayer();
                LookForTargets();
                break;
            case ShadowState.Attacking:
                AttackTarget();
                break;
            case ShadowState.Returning:
                ReturnToPlayer();
                break;
        }
    }

    void LookForTargets()
    {
        // Simple auto-acquire target (can be made more sophisticated)
        Collider[] hitColliders = Physics.OverlapSphere(transform.position, detectionRadius, LayerMask.GetMask("Enemies")); // Assuming enemies are on "Enemies" layer
        Transform closestTarget = null;
        float minDistance = Mathf.Infinity;

        foreach (var hitCollider in hitColliders)
        {
            // TODO: Ensure it's a valid enemy (e.g., has EnemyHealth script, not another shadow)
            float distanceToEnemy = Vector3.Distance(transform.position, hitCollider.transform.position);
            if (distanceToEnemy < minDistance)
            {
                minDistance = distanceToEnemy;
                closestTarget = hitCollider.transform;
            }
        }

        if (closestTarget != null)
        {
            SetTarget(closestTarget);
            ChangeState(ShadowState.Attacking);
        }
    }

    void FollowPlayer()
    {
        float distanceToPlayer = Vector3.Distance(transform.position, playerTransform.position);
        if (distanceToPlayer > followDistance)
        {
            navMeshAgent.SetDestination(playerTransform.position);
            navMeshAgent.isStopped = false;
        }
        else
        {
            navMeshAgent.isStopped = true; // Stop if close enough
        }
    }

    void AttackTarget()
    {
        if (currentTarget == null)
        {
            ChangeState(ShadowState.Following); // Target lost or destroyed
            return;
        }

        float distanceToTarget = Vector3.Distance(transform.position, currentTarget.position);
        if (distanceToTarget <= attackRange)
        {
            navMeshAgent.isStopped = true;
            // Perform attack (animation, deal damage)
            // Debug.Log($"{gameObject.name} attacks {currentTarget.name} for {shadowStrength} damage.");
            // currentTarget.GetComponent<EnemyHealth>()?.TakeDamage(shadowStrength); // Example damage dealing
            // lastAttackTime = Time.time; // Implement attack cooldown

            // For simplicity, let's assume it instantly "damages" and then might re-evaluate
            // In a real game, attack would be an animation, then check if target still alive/in range
        }
        else
        {
            navMeshAgent.SetDestination(currentTarget.position);
            navMeshAgent.isStopped = false;
        }

        // If target moves too far or player calls shadows back
        if (distanceToTarget > detectionRadius * 1.5f) // Target ran away
        {
            currentTarget = null;
            ChangeState(ShadowState.Returning);
        }
    }

    void ReturnToPlayer()
    {
        navMeshAgent.SetDestination(playerTransform.position);
        navMeshAgent.isStopped = false;
        if (Vector3.Distance(transform.position, playerTransform.position) <= followDistance)
        {
            ChangeState(ShadowState.Following);
        }
    }

    public void SetTarget(Transform newTarget)
    {
        currentTarget = newTarget;
        ChangeState(ShadowState.Attacking);
    }

    public void Recall() // Player command to return
    {
        currentTarget = null;
        ChangeState(ShadowState.Returning);
    }

    void ChangeState(ShadowState newState)
    {
        if (currentState == newState) return;
        currentState = newState;

        // Handle state entry logic if needed
        if (currentState == ShadowState.Attacking && currentTarget != null)
        {
            navMeshAgent.stoppingDistance = attackRange * 0.8f; // Stop closer when attacking
        } else
        {
            navMeshAgent.stoppingDistance = followDistance * 0.8f;
        }
    }

    // Shadow health, unsummoning on "death", etc. would also be needed.
}
