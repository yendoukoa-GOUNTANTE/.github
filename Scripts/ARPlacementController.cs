using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

public class ARPlacementController : MonoBehaviour
{
    public GameObject objectToPlacePrefab; // Assign your 3D model prefab here in the Inspector
    private ARRaycastManager arRaycastManager;
    private List<ARRaycastHit> hits = new List<ARRaycastHit>();
    private GameObject placedObject;

    void Start()
    {
        arRaycastManager = GetComponent<ARRaycastManager>();
        if (arRaycastManager == null)
        {
            Debug.LogError("ARRaycastManager not found on this GameObject.");
            enabled = false; // Disable the script if manager is missing
        }

        if (objectToPlacePrefab == null)
        {
            Debug.LogError("ObjectToPlacePrefab is not assigned.");
            enabled = false;
        }
    }

    void Update()
    {
        if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)
        {
            Touch touch = Input.GetTouch(0);
            TryPlaceObject(touch.position);
        }
    }

    private void TryPlaceObject(Vector2 screenPosition)
    {
        if (arRaycastManager.Raycast(screenPosition, hits, TrackableType.PlaneWithinPolygon))
        {
            // Raycast hit a plane, get the hit pose
            Pose hitPose = hits[0].pose;

            if (placedObject == null)
            {
                // Instantiate the object for the first time
                placedObject = Instantiate(objectToPlacePrefab, hitPose.position, hitPose.rotation);
            }
            else
            {
                // Move the existing object to the new hit position
                placedObject.transform.position = hitPose.position;
                placedObject.transform.rotation = hitPose.rotation;
            }

            Debug.Log($"Object placed/moved to {hitPose.position}");
        }
    }
}
