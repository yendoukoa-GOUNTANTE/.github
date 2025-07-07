// THIS IS MOCK/PLACEHOLDER DATA FOR THE POC for PremiumAssets.sol
// In a real deployment, this would come from your deployment process (e.g., Hardhat artifacts)
// and the contract would be deployed to a live testnet/mainnet.

export const premiumAssetsContractAddress = "0xPREMIUM_ASSETS_CONTRACT_ADDRESS_ON_SEPOLIA"; // REPLACE with actual deployed address
export const premiumAssetsContractABI = [
  // Constructor (for reference, not typically called from frontend)
  // {
  //   "inputs": [
  //     { "internalType": "string", "name": "initialBaseURI", "type": "string" },
  //     { "internalType": "address", "name": "initialOwner", "type": "address" }
  //   ],
  //   "stateMutability": "nonpayable",
  //   "type": "constructor"
  // },
  // Events
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "assetId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "maxSupply", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" },
      { "indexed": false, "internalType": "bool", "name": "isActiveForSale", "type": "bool" }
    ],
    "name": "AssetTypeCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "assetId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" },
      { "indexed": false, "internalType": "bool", "name": "isActiveForSale", "type": "bool" }
    ],
    "name": "AssetTypeUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "assetId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "quantity", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "totalPrice", "type": "uint256" }
    ],
    "name": "AssetPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "account", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "operator", "type": "address" },
      { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "operator", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" },
      { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" }
    ],
    "name": "TransferBatch",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "operator", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "TransferSingle",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "string", "name": "value", "type": "string" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "URI",
    "type": "event"
  },
  // View functions
  {
    "inputs": [ {"internalType": "uint256", "name": "assetId", "type": "uint256"} ],
    "name": "assetTypes",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "uint256", "name": "maxSupply", "type": "uint256" },
      { "internalType": "uint256", "name": "currentSupply", "type": "uint256" },
      { "internalType": "uint256", "name": "price", "type": "uint256" },
      { "internalType": "bool", "name": "exists", "type": "bool" },
      { "internalType": "bool", "name": "isActiveForSale", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" },
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "balanceOf",
    "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address[]", "name": "accounts", "type": "address[]" },
      { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }
    ],
    "name": "balanceOfBatch",
    "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" },
      { "internalType": "address", "name": "operator", "type": "address" }
    ],
    "name": "isApprovedForAll",
    "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [ { "internalType": "address", "name": "", "type": "address" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [ {"internalType": "bytes4", "name": "interfaceId", "type": "bytes4"} ],
    "name": "supportsInterface",
    "outputs": [ {"internalType": "bool", "name": "", "type": "bool"} ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [ {"internalType": "uint256", "name": "assetId", "type": "uint256"} ],
    "name": "uri",
    "outputs": [ {"internalType": "string", "name": "", "type": "string"} ],
    "stateMutability": "view",
    "type": "function"
  },
  // Write functions
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "uint256", "name": "assetId", "type": "uint256" },
      { "internalType": "uint256", "name": "quantity", "type": "uint256" },
      { "internalType": "bytes", "name": "data", "type": "bytes" }
    ],
    "name": "adminMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "uint256", "name": "maxSupply", "type": "uint256" },
      { "internalType": "uint256", "name": "price", "type": "uint256" },
      { "internalType": "bool", "name": "isActiveForSale", "type": "bool" }
    ],
    "name": "createAssetType",
    "outputs": [ {"internalType": "uint256", "name": "", "type": "uint256"} ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "assetId", "type": "uint256" },
      { "internalType": "uint256", "name": "quantity", "type": "uint256" }
    ],
    "name": "purchase",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "from", "type": "address" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" },
      { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" },
      { "internalType": "bytes", "name": "data", "type": "bytes" }
    ],
    "name": "safeBatchTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "from", "type": "address" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "bytes", "name": "data", "type": "bytes" }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "operator", "type": "address" },
      { "internalType": "bool", "name": "approved", "type": "bool" }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [ {"internalType": "string", "name": "newBaseURI", "type": "string"} ],
    "name": "setBaseURI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "assetId", "type": "uint256" },
      { "internalType": "uint256", "name": "newPrice", "type": "uint256" },
      { "internalType": "bool", "name": "newIsActiveForSale", "type": "bool" }
    ],
    "name": "updateAssetType",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [ {"internalType": "address", "name": "newOwner", "type": "address"} ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Use the same Sepolia Chain ID and RPC URL as defined in contractInfo.ts
// Or import them if that file is structured to export them.
export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_RPC_URL = "https://rpc.sepolia.org";
// Example Base URI for metadata (replace with your actual metadata server/path)
export const PREMIUM_ASSETS_BASE_URI = "https://ar-painter.com/api/premium-assets/";
