// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
// For operator filtering, if desired for marketplace safety:
// import "@openzeppelin/contracts/utils/OperatorFilterer.sol"; // Using DefaultOperatorFilterer for simplicity if chosen

/**
 * @title PlayerArtwork
 * @dev ERC721 contract where players can mint their AR creations as NFTs.
 * Implements ERC2981 for royalty payments on secondary sales.
 * Optionally, can inherit from DefaultOperatorFilterer to restrict operators (e.g., marketplaces).
 */
contract PlayerArtwork is ERC721, ERC721URIStorage, Ownable, IERC2981 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Royalty information
    address private _royaltyRecipient;
    uint96 private _royaltyFraction; // Basis points, e.g., 500 for 5%

    // Event for when royalty info is updated
    event RoyaltyInfoUpdated(address newRecipient, uint96 newRoyaltyFraction);
    event ArtworkMinted(address indexed artist, uint256 indexed tokenId, string tokenURI);

    // For PoC, we might not use operator filtering to keep it simpler,
    // but in production, it's good for safety (e.g., against malicious marketplaces)
    // If using DefaultOperatorFilterer:
    // constructor(string memory name, string memory symbol, address initialOwner, address royaltyRecipientAddress, uint96 initialRoyaltyFraction)
    //     ERC721(name, symbol)
    //     Ownable(initialOwner)
    //     DefaultOperatorFilterer(initialOwner,payable(0)) // Set subscription or payable(0) if no subscription
    // { ... }
    // And override _approve, setApprovalForAll, transferFrom, safeTransferFrom to include operator filtering modifiers.

    constructor(
        string memory name,
        string memory symbol,
        address initialOwner,
        address royaltyRecipientAddress,
        uint96 initialRoyaltyFraction // e.g., 500 for 5% (500 / 10000)
    ) ERC721(name, symbol) Ownable(initialOwner) {
        require(royaltyRecipientAddress != address(0), "Royalty recipient cannot be zero address");
        require(initialRoyaltyFraction <= 10000, "Royalty fraction cannot exceed 100%"); // Max 100% or a lower practical limit
        _royaltyRecipient = royaltyRecipientAddress;
        _royaltyFraction = initialRoyaltyFraction;
    }

    /**
     * @dev Mints a new artwork NFT to the caller (the artist).
     * The caller is responsible for providing the metadata URI (e.g., IPFS CID).
     * @param tokenURI_ The URI for the token's metadata JSON.
     */
    function mintArtwork(string memory tokenURI_) public returns (uint256) {
        uint256 newTokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI_);

        emit ArtworkMinted(msg.sender, newTokenId, tokenURI_);
        return newTokenId;
    }

    /**
     * @dev See {IERC2981-royaltyInfo}.
     * Returns the royalty recipient and amount for a given sale price.
     */
    function royaltyInfo(
        uint256, /*tokenId*/ // tokenId is not used by this simple global royalty implementation
        uint256 _salePrice
    ) external view override returns (address receiver, uint256 royaltyAmount) {
        receiver = _royaltyRecipient;
        royaltyAmount = (_salePrice * _royaltyFraction) / 10000;
    }

    /**
     * @dev Allows the contract owner to update the royalty recipient and fraction.
     */
    function setRoyaltyInfo(address newRecipient, uint96 newRoyaltyFraction) public onlyOwner {
        require(newRecipient != address(0), "Royalty: New recipient cannot be zero address");
        require(newRoyaltyFraction <= 10000, "Royalty: Fraction cannot exceed 100%");
        _royaltyRecipient = newRecipient;
        _royaltyFraction = newRoyaltyFraction;
        emit RoyaltyInfoUpdated(newRecipient, newRoyaltyFraction);
    }

    /**
     * @dev Allows the contract owner to withdraw any ETH sent to the contract by mistake.
     * This is NOT for royalty payments, those are handled by marketplaces supporting ERC2981.
     */
    function withdrawEth() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }


    // --- ERC165 Support ---
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    // The following functions are overrides required by Solidity.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721URIStorage)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 amount)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._increaseBalance(account, amount);
    }

    // Required by ERC721URIStorage
    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
        override(ERC721URIStorage)
    {
        super._setTokenURI(tokenId, _tokenURI);
    }

    // To use DefaultOperatorFilterer, you would uncomment its import and constructor part,
    // and add these overrides:
    // function setApprovalForAll(address operator, bool approved) public override(ERC721, IOperatorFilterer) onlyAllowedOperatorApproval(operator) {
    //     super.setApprovalForAll(operator, approved);
    // }
    // function approve(address operator, uint256 tokenId) public override(ERC721, IOperatorFilterer) onlyAllowedOperatorApproval(operator) {
    //     super.approve(operator, tokenId);
    // }
    // function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IOperatorFilterer) onlyAllowedOperator(from) {
    //     super.transferFrom(from, to, tokenId);
    // }
    // function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override(ERC721, IOperatorFilterer) onlyAllowedOperator(from) {
    //     super.safeTransferFrom(from, to, tokenId, data);
    // }
}
