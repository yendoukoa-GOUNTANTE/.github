// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; // For toString

// Note: To actually compile this, you'd need OpenZeppelin contracts installed
// e.g., in Hardhat/Truffle: npm install @openzeppelin/contracts

contract SoloLevelingItem is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Base URI for metadata. Can be updated by owner.
    // Example: "https://api.mygame.com/items/" or "ipfs://<CID>/"
    string private _baseTokenURI;

    // Mapping from token ID to item-specific stats (example)
    // In a real scenario, more complex data might be part of the metadata JSON
    struct ItemStats {
        uint256 attackPower;
        uint256 defensePower;
        string itemType; // e.g., "Weapon", "Armor", "Shadow"
    }
    mapping(uint256 => ItemStats) public tokenIdToStats;

    event ItemMinted(address indexed owner, uint256 indexed tokenId, uint256 attackPower, uint256 defensePower, string itemType);
    event ItemStatsUpdated(uint256 indexed tokenId, uint256 attackPower, uint256 defensePower, string itemType);


    constructor(string memory initialBaseURI, address initialOwner)
        ERC721("SoloLevelingItem", "SLI") // Token Name, Token Symbol
        Ownable(initialOwner) // Set the contract deployer as the initial owner
    {
        _baseTokenURI = initialBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    // Only owner (e.g., game server admin) can mint new items
    function safeMint(address to, uint256 attack, uint256 defense, string memory itemType) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        // Store basic stats on-chain (optional, could also be purely in metadata)
        tokenIdToStats[tokenId] = ItemStats(attack, defense, itemType);
        emit ItemMinted(to, tokenId, attack, defense, itemType);
        return tokenId;
    }

    // Function to update stats by owner (e.g. game balancing)
    function updateItemStats(uint256 tokenId, uint256 attack, uint256 defense, string memory itemType) public onlyOwner {
        require(_exists(tokenId), "ERC721: token query for nonexistent token");
        tokenIdToStats[tokenId] = ItemStats(attack, defense, itemType);
        emit ItemStatsUpdated(tokenId, attack, defense, itemType);
    }

    // The tokenURI function is essential for NFTs. It returns the URL to the item's metadata.
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721: URI query for nonexistent token");
        string memory baseURI = _baseURI();
        // If there is no base URI, return an empty string.
        // If there is a base URI, append the token ID to it.
        // Example: "https://api.mygame.com/items/1.json"
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json")) : "";
    }

    // Override to ensure Ownable's owner is used
    // function _transfer(address from, address to, uint256 tokenId) internal virtual override {
    //     super._transfer(from, to, tokenId);
    // }

    // function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
    //     super._burn(tokenId);
    // }

    // function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, IERC165) returns (bool) {
    //     return super.supportsInterface(interfaceId);
    // }
}
