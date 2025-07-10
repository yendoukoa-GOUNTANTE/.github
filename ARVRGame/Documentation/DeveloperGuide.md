# Developer Guide - AR/VR Cycling Game

## Introduction

This guide is intended for developers looking to understand, extend, or contribute to the AR/VR Cycling Game project. It assumes familiarity with C# and general game development concepts. If you are using a specific game engine like Unity, knowledge of that engine will also be crucial.

## Core Architecture

The game's architecture is built around a set_plan of manager scripts that handle distinct aspects of the game. The `GameManager.cs` script acts as the central hub, coordinating actions between other managers.

### Key Manager Scripts:

*   **`GameManager.cs`**:
    *   **Responsibilities**: Manages overall game state (`MainMenu`, `Playing`, `Paused`, `GameOver`), current game mode (`Standard`, `AR`, `VR`), and initialization of other managers.
    *   **Key Methods**: `InitializeManagers()`, `SetGameMode(GameMode)`, `StartGame()`, `PauseGame()`, `ResumeGame()`, `EndGame()`, `UpdateGame()`.
    *   **Dependencies**: `CyclingPhysics`, `TrackGenerator`, `ARIntegration`, `VRIntegration`, `UIManager`, `AssetManager`, `SoundManager`.

*   **`CyclingPhysics.cs`**:
    *   **Responsibilities**: Simulates bicycle physics (speed, acceleration, braking, turning).
    *   **Key Methods**: `Accelerate(float)`, `Brake(float)`, `Turn(float)`, `UpdatePhysics()`.
    *   **Dependencies**: `SoundManager` (optional, for playing cycling-related sounds).

*   **`TrackGenerator.cs`**:
    *   **Responsibilities**: Generates or loads track data.
    *   **Key Methods**: `GenerateRandomTrack(int)`, `LoadTrackFromFile(string)`.
    *   **Data Structures**: `TrackSegment` class.

*   **`ARIntegration.cs` / `VRIntegration.cs`**:
    *   **Responsibilities**: Manage AR-specific and VR-specific functionalities, respectively. This includes session management, input handling, and mode-specific setup (e.g., plane detection for AR, play space calibration for VR).
    *   **Key Methods**: `EnableARMode()`, `DisableARMode()`, `UpdateAR()`, `PlaceTrackInAR()` (for AR); `EnableVRMode()`, `DisableVRMode()`, `UpdateVR()`, `CalibrateVRPlaySpace()` (for VR).
    *   **Note**: These are heavily dependent on external SDKs (ARCore, ARKit, Oculus SDK, SteamVR, etc.) which are not part of this codebase.

*   **`UIManager.cs`**:
    *   **Responsibilities**: Controls all UI elements, including menus and HUD. Adapts UI for different game modes.
    *   **Key Methods**: `ShowMainMenu()`, `ShowSettingsMenu()`, `ShowGameplayHUD()`, `Update()`, various `On...ButtonPressed()` event handlers.
    *   **Dependencies**: `GameManager`.

*   **`AssetManager.cs`**:
    *   **Responsibilities**: Loads and manages game assets (models, textures, audio).
    *   **Key Methods**: `LoadModel(string, string)`, `GetModel(string)`, `LoadTexture(...)`, `GetTexture(...)`, `LoadAudioClip(...)`, `GetAudioClip(...)`, `LoadInitialAssets()`.
    *   **Note**: In a real engine, asset loading is often heavily integrated with the engine's own asset database and import pipeline.

*   **`SoundManager.cs`**:
    *   **Responsibilities**: Handles playback of sound effects and music.
    *   **Key Methods**: `PlayMusic(string)`, `StopMusic()`, `PlaySFX(string)`, `SetMusicVolume(float)`, `SetSfxVolume(float)`.
    *   **Dependencies**: `AssetManager`.

### Initialization Sequence:

1.  `GameManager` instance is created.
    *   Its constructor initializes instances of `CyclingPhysics`, `TrackGenerator`, `ARIntegration`, `VRIntegration`, `AssetManager`, and `SoundManager`.
    *   `CyclingPhysics` receives the `SoundManager` instance.
2.  `GameManager.InitializeManagers()` is called.
    *   `AssetManager.LoadInitialAssets()` is called to load placeholder assets.
    *   `UIManager` instance is created, receiving the `GameManager` instance.
    *   Initial background music might be started via `SoundManager`.

## Setting up in a Game Engine (e.g., Unity)

1.  **Project Setup**: Create a new 3D project in your chosen game engine.
2.  **Import Scripts**: Copy the `ARVRGame/Assets/Scripts/` folder into your project's `Assets` (or equivalent) directory.
3.  **Create Main GameObject**:
    *   Create an empty GameObject (e.g., named `_GameManager`).
    *   Attach the `GameManager.cs` script to it.
    *   The `GameManager` will instantiate other managers as needed. In Unity, other managers might also be components on this or other GameObjects, and references can be assigned via the Inspector. The current script structure assumes they are mostly plain C# objects instantiated by `GameManager`.
4.  **AR/VR SDKs**:
    *   Import and configure the necessary AR/VR SDKs for your target platforms (e.g., Unity's XR Plugin Management, ARFoundation, Oculus Integration, SteamVR Plugin).
    *   Modify `ARIntegration.cs` and `VRIntegration.cs` to use the APIs from these SDKs. This is a significant task.
5.  **Asset Integration**:
    *   Populate `ARVRGame/Assets/Models/`, `Textures/`, `Audio/` with actual game assets.
    *   Update file paths in `AssetManager.LoadInitialAssets()` or implement a more robust asset loading system using engine features.
6.  **UI Implementation**:
    *   Use the engine's UI system (e.g., Unity UI, UMG for Unreal) to build the visual UI components.
    *   Connect UI events (e.g., button clicks) to the public methods in `UIManager.cs` (e.g., `OnStartGameButtonPressed()`).
7.  **Scene Setup**:
    *   Create scenes for the main menu, gameplay, etc.
    *   The gameplay scene will need a representation of the player's bicycle and the track. The track geometry would be generated or placed by `TrackGenerator.cs`.

## Extending Functionality

*   **New Game Mechanics**: If adding new mechanics (e.g., power-ups), consider if they need a new manager script or can be integrated into existing ones. Update `GameManager` if coordination is needed.
*   **Advanced Physics**: The `CyclingPhysics.cs` is currently very basic. It can be expanded to include more realistic physics (e.g., air resistance, tire friction, leaning effects).
*   **Track Variety**: Enhance `TrackGenerator.cs` to create more complex and varied tracks. This might involve different algorithms for path generation, terrain height-maps, and placement of scenery objects.
*   **AI Opponents**: This would likely require new scripts for AI behavior, pathfinding on the track, and updates to `GameManager` to manage AI cyclists.
*   **Networking for Multiplayer**: This is a major addition and would require a networking library/solution and significant changes to game state management.

## Testing

*   The `ARVRGame/Assets/Scripts/Tests/` directory contains placeholder unit tests (`GameManagerTests.cs`) and a conceptual `TestRunner.cs`.
*   For engine-specific testing (e.g., Unity Test Runner), create tests within the engine's framework.
*   Focus on testing:
    *   Game state transitions in `GameManager`.
    *   Logic in `CyclingPhysics` (e.g., speed calculations under different inputs).
    *   `TrackGenerator` output.
    *   UI interactions and state changes in `UIManager`.
    *   AR/VR mode switching and basic SDK interactions (once implemented).

## Coding Conventions

*   **Naming**: Use PascalCase for class names, method names, and properties. Use camelCase for local variables and private fields (though a `_` prefix for private fields is also common, e.g., `_currentSpeed`).
*   **Comments**: Add comments to explain complex logic, public API contracts, and any non-obvious behavior. Use XML documentation comments for public members to support IntelliSense and documentation generation.
*   **Modularity**: Keep classes focused on specific responsibilities. Use interfaces where appropriate to decouple components (not heavily used in this initial scaffold but good for future growth).

This guide provides a starting point. As the project grows, more specific documentation for individual systems will be necessary.
