// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title PremiumAssets
 * @dev ERC1155 contract for managing ownable in-game premium assets
 * like special patterns, brushes, or themes.
 */
contract PremiumAssets is ERC1155, Ownable {
    using Strings for uint256;

    // Base URI for all token types. The URI for a specific token ID will be {baseURI}{id}.json
    string private _baseURI;

    // Struct to hold information about each asset type
    struct AssetType {
        uint256 id; // Same as the token ID for this asset type
        string name;
        uint256 maxSupply; // 0 for infinite, otherwise limited
        uint256 currentSupply;
        uint256 price; // Price in wei (e.g., MATIC or ETH)
        bool exists;
        bool isActiveForSale; // If this asset type can currently be purchased
    }

    // Mapping from asset ID (token ID) to its AssetType details
    mapping(uint256 => AssetType) public assetTypes;

    // Counter for creating new asset IDs. Start from 1.
    uint256 private _nextAssetId = 1;

    // Events
    event AssetTypeCreated(uint256 indexed assetId, string name, uint256 maxSupply, uint256 price, bool isActiveForSale);
    event AssetTypeUpdated(uint256 indexed assetId, uint256 price, bool isActiveForSale);
    event AssetPurchased(address indexed buyer, uint256 indexed assetId, uint256 quantity, uint256 totalPrice);

    constructor(
        string memory initialBaseURI,
        address initialOwner
    ) ERC1155("") Ownable(initialOwner) { // URI is set per-token via uri() override
        _baseURI = initialBaseURI;
    }

    /**
     * @dev See {IERC1155MetadataURI-uri}.
     * Returns the URI for a given token ID.
     */
    function uri(uint256 assetId) public view virtual override returns (string memory) {
        require(assetTypes[assetId].exists, "PremiumAssets: Asset ID does not exist");
        return string(abi.encodePacked(_baseURI, assetId.toString(), ".json"));
    }

    /**
     * @dev Updates the base URI for all token types.
     */
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseURI = newBaseURI;
    }

    /**
     * @dev Admin function to create a new type of premium asset.
     * @param name Name of the asset (e.g., "Golden Stripes Pattern", "Rainbow Brush").
     * @param maxSupply Maximum number of this asset that can ever be minted. 0 for unlimited.
     * @param price Price in wei for one unit of this asset.
     * @param isActiveForSale Whether this asset is immediately available for purchase.
     */
    function createAssetType(
        string memory name,
        uint256 maxSupply,
        uint256 price,
        bool isActiveForSale
    ) public onlyOwner returns (uint256) {
        uint256 assetId = _nextAssetId;
        _nextAssetId++;

        assetTypes[assetId] = AssetType({
            id: assetId,
            name: name,
            maxSupply: maxSupply,
            currentSupply: 0,
            price: price,
            exists: true,
            isActiveForSale: isActiveForSale
        });

        emit AssetTypeCreated(assetId, name, maxSupply, price, isActiveForSale);
        return assetId;
    }

    /**
     * @dev Admin function to update the price or sale status of an existing asset type.
     */
    function updateAssetType(uint256 assetId, uint256 newPrice, bool newIsActiveForSale) public onlyOwner {
        require(assetTypes[assetId].exists, "PremiumAssets: Asset ID does not exist");
        assetTypes[assetId].price = newPrice;
        assetTypes[assetId].isActiveForSale = newIsActiveForSale;
        emit AssetTypeUpdated(assetId, newPrice, newIsActiveForSale);
    }

    /**
     * @dev Allows users to purchase one or more units of an asset type.
     * @param assetId The ID of the asset type to purchase.
     * @param quantity The number of units to purchase.
     */
    function purchase(uint256 assetId, uint256 quantity) public payable {
        AssetType storage asset = assetTypes[assetId];
        require(asset.exists, "PremiumAssets: Asset ID does not exist");
        require(asset.isActiveForSale, "PremiumAssets: This asset is not currently for sale");
        require(quantity > 0, "PremiumAssets: Quantity must be greater than zero");

        if (asset.maxSupply > 0) {
            require(asset.currentSupply + quantity <= asset.maxSupply, "PremiumAssets: Purchase would exceed max supply");
        }

        uint256 requiredPayment = asset.price * quantity;
        require(msg.value >= requiredPayment, "PremiumAssets: Insufficient payment sent");

        asset.currentSupply += quantity;
        _mint(msg.sender, assetId, quantity, ""); // No data field needed for basic mint

        emit AssetPurchased(msg.sender, assetId, quantity, requiredPayment);

        // Refund any overpayment
        if (msg.value > requiredPayment) {
            payable(msg.sender).transfer(msg.value - requiredPayment);
        }
    }

    /**
     * @dev Admin function to mint specific quantities of an asset to a recipient.
     * Useful for airdrops, rewards, or initial distribution if not sold directly.
     * This bypasses the purchase price but respects max supply.
     */
    function adminMint(address recipient, uint256 assetId, uint256 quantity, bytes memory data) public onlyOwner {
        AssetType storage asset = assetTypes[assetId];
        require(asset.exists, "PremiumAssets: Asset ID does not exist");
        if (asset.maxSupply > 0) {
            require(asset.currentSupply + quantity <= asset.maxSupply, "PremiumAssets: Minting would exceed max supply");
        }
        asset.currentSupply += quantity;
        _mint(recipient, assetId, quantity, data);
    }

    /**
     * @dev Admin function to withdraw contract balance (from sales).
     */
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // The following functions are overrides required by Solidity.
    function _update(address from, address to, uint256[] memory ids, uint256[] memory values, bytes memory data)
        internal
        override(ERC1155)
    {
        super._update(from, to, ids, values, data);
    }
}
