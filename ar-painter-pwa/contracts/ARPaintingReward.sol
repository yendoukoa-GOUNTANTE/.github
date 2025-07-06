// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ARPaintingReward
 * @dev A simple ERC721 token for rewarding players in an AR painting game.
 * Each token represents a unique achievement or reward.
 */
contract ARPaintingReward is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Base URI for metadata. Example: "https://api.arpainter.game/rewards/"
    // For PoC, this might point to a generic IPFS location or be set later.
    string private _baseTokenURI;

    // Mapping from token ID to a simple reward name (could be part of metadata JSON too)
    mapping(uint256 => string) public tokenIdToRewardName;

    event RewardMinted(address indexed recipient, uint256 indexed tokenId, string rewardName);

    constructor(
        string memory initialBaseURI,
        address initialOwner
    ) ERC721("ARPaintingReward", "ARPR") Ownable(initialOwner) {
        _baseTokenURI = initialBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Sets the base URI for all token IDs.
     * This URI is used to construct the tokenURI for each token.
     * Example: "ipfs://<CID>/" or "https://myapiserver.com/api/token/"
     * The final tokenURI will be baseURI + tokenId + ".json"
     */
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    /**
     * @dev Mints a new reward token to a player.
     * Only the owner (game admin/server) can call this.
     * @param recipient The address that will receive the minted token.
     * @param rewardName A descriptive name for the reward (e.g., "First Masterpiece", "Color Expert").
     *                   This will also be used to form part of the metadata.
     */
    function mintReward(address recipient, string memory rewardName) public onlyOwner returns (uint256) {
        uint256 newTokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(recipient, newTokenId);
        tokenIdToRewardName[newTokenId] = rewardName;

        emit RewardMinted(recipient, newTokenId, rewardName);
        return newTokenId;
    }

    /**
     * @dev Returns the URI for a given token ID.
     * This URI should point to a JSON file that conforms to the ERC721 Metadata JSON Schema.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        // If baseURI is set, append tokenId and ".json" (standard for many NFT projects)
        // Otherwise, return an empty string.
        // For PoC, the actual JSON metadata might not be hosted yet, but the URI structure is defined.
        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json"))
            : "";
    }

    // --- For PoC: Simplified Metadata Generation (On-Chain Fallback) ---
    // In a real scenario, tokenURI would point to an off-chain JSON file.
    // This function is a helper to generate a basic JSON string directly if needed,
    // but it's NOT standard for tokenURI to return JSON directly.
    // It's more for internal reference or very basic PoC where off-chain metadata isn't set up.
    function getJsonMetadata(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        string memory rewardName = tokenIdToRewardName[tokenId];
        // Basic JSON structure
        return string(abi.encodePacked(
            '{"name": "', rewardName, '", ',
            '"description": "A unique reward from AR Painter game!", ',
            '"image": "', _baseURI(), Strings.toString(tokenId), '.png", ', // Assuming image might follow same base + id pattern
            '"attributes": [{"trait_type": "Reward Type", "value": "', rewardName, '"}]}'
        ));
    }
}
