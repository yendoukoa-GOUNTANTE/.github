using UnityEngine;
using UnityEngine.AI; // Required for NavMeshAgent

public class MeleeMonsterAI : MonoBehaviour
{
    public enum AIState
    {
        Idle,
        Patrol,
        Chase,
        Attack
    }

    public AIState currentState = AIState.Idle;

    public Transform playerTransform; // Assign the player's transform
    public float detectionRadius = 10f;
    public float attackRange = 2f;
    public float patrolSpeed = 2f;
    public float chaseSpeed = 4f;
    public float attackCooldown = 2f;
    private float lastAttackTime = -Mathf.Infinity;

    public Transform[] patrolPoints; // Assign waypoints for patrolling
    private int currentPatrolIndex = 0;

    private NavMeshAgent navMeshAgent;
    private Animator animator; // For controlling animations

    void Start()
    {
        navMeshAgent = GetComponent<NavMeshAgent>();
        animator = GetComponent<Animator>(); // Optional: if you have animations

        if (playerTransform == null)
        {
            // Try to find player by tag if not assigned
            GameObject player = GameObject.FindGameObjectWithTag("Player");
            if (player != null)
            {
                playerTransform = player.transform;
            }
            else
            {
                Debug.LogError("Player transform not assigned and not found by tag 'Player'. AI may not function correctly.");
                // currentState = AIState.Idle; // Stay idle if no player
                // enabled = false; // Or disable AI
            }
        }

        if (navMeshAgent == null)
        {
            Debug.LogError("NavMeshAgent component not found on this NPC.");
            enabled = false; // Disable AI if no NavMeshAgent
            return;
        }

        // Initialize state
        if (patrolPoints == null || patrolPoints.Length == 0)
        {
            currentState = AIState.Idle;
        }
        else
        {
            currentState = AIState.Patrol;
            navMeshAgent.speed = patrolSpeed;
            GoToNextPatrolPoint();
        }
    }

    void Update()
    {
        if (playerTransform == null && currentState != AIState.Idle && currentState != AIState.Patrol) {
            // If player is lost (e.g. destroyed) and we were chasing/attacking, revert to patrol or idle
            currentState = (patrolPoints != null && patrolPoints.Length > 0) ? AIState.Patrol : AIState.Idle;
        }


        float distanceToPlayer = playerTransform != null ? Vector3.Distance(transform.position, playerTransform.position) : Mathf.Infinity;

        switch (currentState)
        {
            case AIState.Idle:
                HandleIdleState(distanceToPlayer);
                break;
            case AIState.Patrol:
                HandlePatrolState(distanceToPlayer);
                break;
            case AIState.Chase:
                HandleChaseState(distanceToPlayer);
                break;
            case AIState.Attack:
                HandleAttackState(distanceToPlayer);
                break;
        }
    }

    void HandleIdleState(float distanceToPlayer)
    {
        // Optional: Look around, play idle animation
        // animator?.SetBool("IsWalking", false);
        // animator?.SetBool("IsChasing", false);

        if (playerTransform != null && distanceToPlayer <= detectionRadius)
        {
            ChangeState(AIState.Chase);
        }
        else if (patrolPoints != null && patrolPoints.Length > 0)
        {
            // After some time, could transition to Patrol
            // For now, just stays idle if no player or patrol points
        }
    }

    void HandlePatrolState(float distanceToPlayer)
    {
        navMeshAgent.speed = patrolSpeed;
        // animator?.SetBool("IsWalking", true);
        // animator?.SetBool("IsChasing", false);

        if (playerTransform != null && distanceToPlayer <= detectionRadius)
        {
            ChangeState(AIState.Chase);
            return;
        }

        if (!navMeshAgent.pathPending && navMeshAgent.remainingDistance < 0.5f)
        {
            GoToNextPatrolPoint();
        }
    }

    void HandleChaseState(float distanceToPlayer)
    {
        navMeshAgent.speed = chaseSpeed;
        // animator?.SetBool("IsWalking", false); // Or use a "Run" animation
        // animator?.SetBool("IsChasing", true);

        if (playerTransform == null) { // Player disappeared
            ChangeState(AIState.Patrol); // Or Idle
            return;
        }

        navMeshAgent.SetDestination(playerTransform.position);

        if (distanceToPlayer <= attackRange)
        {
            ChangeState(AIState.Attack);
        }
        else if (distanceToPlayer > detectionRadius * 1.5f) // Player got too far (add a buffer)
        {
            ChangeState(AIState.Patrol); // Or Idle
        }
    }

    void HandleAttackState(float distanceToPlayer)
    {
        // Stop movement while attacking
        if (navMeshAgent.hasPath) navMeshAgent.ResetPath(); // Or navMeshAgent.isStopped = true;

        // animator?.SetBool("IsChasing", false);

        if (playerTransform == null) { // Player disappeared
            ChangeState(AIState.Patrol); // Or Idle
            return;
        }

        // Face the player
        transform.LookAt(playerTransform.position);


        if (Time.time > lastAttackTime + attackCooldown)
        {
            // animator?.SetTrigger("Attack");
            Debug.Log(gameObject.name + " attacks " + playerTransform.name);
            // TODO: Implement actual damage dealing mechanism
            // e.g., SendMessage("TakeDamage", damageAmount) to player or call a method on player's health script

            lastAttackTime = Time.time;
        }

        // Check if player moved out of attack range during or after attack
        if (distanceToPlayer > attackRange)
        {
            ChangeState(AIState.Chase);
        }
        // Could also add a check: if player is still in detectionRadius but not attackRange, go to Chase.
        // If player is outside detectionRadius, go to Patrol/Idle.
    }

    void ChangeState(AIState newState)
    {
        if (currentState == newState) return;

        currentState = newState;
        // Debug.Log("Changed state to: " + newState);

        switch (currentState)
        {
            case AIState.Idle:
                navMeshAgent.isStopped = true; // Stop agent for idle
                // animator?.SetBool("IsWalking", false);
                // animator?.SetBool("IsChasing", false);
                break;
            case AIState.Patrol:
                navMeshAgent.isStopped = false;
                navMeshAgent.speed = patrolSpeed;
                GoToNextPatrolPoint(); // Ensure it starts patrolling immediately
                // animator?.SetBool("IsWalking", true);
                // animator?.SetBool("IsChasing", false);
                break;
            case AIState.Chase:
                navMeshAgent.isStopped = false;
                navMeshAgent.speed = chaseSpeed;
                // animator?.SetBool("IsWalking", false); // Or run animation
                // animator?.SetBool("IsChasing", true);
                break;
            case AIState.Attack:
                navMeshAgent.isStopped = true; // Stop agent to perform attack
                // animator?.SetBool("IsChasing", false);
                break;
        }
    }

    void GoToNextPatrolPoint()
    {
        if (patrolPoints == null || patrolPoints.Length == 0)
        {
            ChangeState(AIState.Idle); // No points to patrol
            return;
        }
        navMeshAgent.SetDestination(patrolPoints[currentPatrolIndex].position);
        currentPatrolIndex = (currentPatrolIndex + 1) % patrolPoints.Length;
    }

    // Optional: Visualize detection radius in editor
    void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.yellow;
        Gizmos.DrawWireSphere(transform.position, detectionRadius);
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(transform.position, attackRange);
    }
}
