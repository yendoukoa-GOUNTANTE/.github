import { Pattern } from './patterns'; // Assuming Pattern type is relevant

// --- 1. Data Capture Definition ---
export interface PlacedObjectData {
  id: string; // Unique ID for the object in the scene
  geometry: 'sphere' | 'box'; // Add more as they are supported
  position: { x: number; y: number; z: number };
  // rotation: { x: number; y: number; z: number }; // For future enhancement
  // scale: { x: number; y: number; z: number };    // For future enhancement
  patternId: string; // ID of the Pattern used (from patterns.ts or premium assets)
  // We might resolve this to actual pattern details (colors, style) for metadata
  // or store just the ID and expect the renderer to resolve it.
  // For simplicity in metadata, resolving some key aspects like main color might be good.
  color1: string;
  color2?: string;
  style: string;
}

export interface ARArtworkData {
  title: string;
  description: string;
  artistAddress?: string; // Address of the creator
  objects: PlacedObjectData[];
  createdAt: string; // ISO date string
  // Potentially add a preview image data URL or link here if captured client-side
  previewImage?: string;
}

// --- 2. Metadata JSON Structure (ERC-721) ---
export interface ERC721Metadata {
  name: string;
  description: string;
  image: string; // Should be an IPFS URI: "ipfs://<IMAGE_CID>/image.png"
  attributes: Array<{
    trait_type: string;
    value: string | number | object; // OpenSea supports object attributes for more detail
  }>;
  // Optional: external_url, animation_url, background_color, youtube_url
}

// --- 3. IPFS Upload Simulation & Metadata Generation ---

// Placeholder for a function that would upload a file (e.g., image or JSON) to IPFS
// In a real app, this would use an IPFS client like 'ipfs-http-client' or a pinning service API.
async function uploadToIPFSSimulation(content: string | File, fileName: string): Promise<string> {
  console.log(`[IPFS SIMULATION] Uploading ${fileName}... Content sample:`, typeof content === 'string' ? content.substring(0,100) + "..." : content.name);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  const placeholderCID = `QmSimulated${fileName.replace(/[^a-zA-Z0-9]/g, '')}${Date.now()}`;
  console.log(`[IPFS SIMULATION] ${fileName} uploaded. Simulated CID: ${placeholderCID}`);
  return placeholderCID;
}

export async function generateAndUploadArtworkMetadata(
  artworkData: ARArtworkData,
  // For PoC, we'll use a placeholder image CID.
  // In a real app, you'd first upload the artwork image (if any) to get its CID.
  placeholderImageCID: string = "QmPlaceholderImageCID"
): Promise<string> { // Returns the IPFS CID of the metadata JSON file

  console.log("Generating metadata for artwork:", artworkData.title);

  // Create attributes for the metadata
  const attributes: ERC721Metadata['attributes'] = [
    { trait_type: "Objects Painted", value: artworkData.objects.length },
    { trait_type: "Created At", value: new Date(artworkData.createdAt).toLocaleDateString() },
  ];

  if (artworkData.artistAddress) {
    attributes.push({ trait_type: "Artist", value: artworkData.artistAddress });
  }

  // Add some detail about patterns used (example)
  const patternTypesUsed = new Set(artworkData.objects.map(obj => obj.style));
  attributes.push({ trait_type: "Pattern Styles Used", value: Array.from(patternTypesUsed).join(', ') || 'N/A' });

  // Optionally, include the detailed scene data as an attribute
  // attributes.push({ trait_type: "AR Scene Data", value: artworkData.objects });


  const metadata: ERC721Metadata = {
    name: artworkData.title || `AR Painting #${Date.now()}`,
    description: artworkData.description || "A unique artwork created in AR Painter PWA.",
    image: `ipfs://${placeholderImageCID}/artwork_image.png`, // Placeholder image path
    attributes: attributes,
  };

  const metadataJsonString = JSON.stringify(metadata, null, 2);

  // Simulate uploading the metadata JSON to IPFS
  const metadataFileCID = await uploadToIPFSSimulation(metadataJsonString, `metadata_${artworkData.title.replace(/\s/g, '_') || 'artwork'}.json`);

  // The tokenURI for the NFT will be "ipfs://METADATA_FILE_CID"
  // Note: Some marketplaces prefer "ipfs://METADATA_FILE_CID/metadata.json" if the CID points to a directory.
  // For a single file CID, "ipfs://METADATA_FILE_CID" is usually fine.
  // Let's assume our upload function returns a CID for the file itself.
  return `ipfs://${metadataFileCID}`;
}

// Helper to collect scene data from A-Frame entities (conceptual)
// This would need to be implemented within ARPainterPage.tsx where sceneEl is available
export function captureSceneData(sceneElement: any): PlacedObjectData[] {
    const capturedObjects: PlacedObjectData[] = [];
    if (!sceneElement) return capturedObjects;

    // Query for all elements that represent a 'paint mark'
    // This requires paint marks to have a specific class or component
    // For example, if we add a component `paint-mark` to each placed sphere/box:
    // const marks = sceneElement.querySelectorAll('[paint-mark]');

    // For this PoC, let's assume paint marks are direct children of the scene
    // and are either <a-sphere> or <a-box> NOT part of the core scene structure (camera, reticle, sky, lights)
    const potentialMarks = Array.from(sceneElement.children).filter((el: any) =>
        (el.tagName.toLowerCase() === 'a-sphere' || el.tagName.toLowerCase() === 'a-box') &&
        el.id !== 'reticle' // Exclude the reticle itself
    );

    potentialMarks.forEach((el: any, index: number) => {
        const position = el.getAttribute('position');
        const color = el.getAttribute('material')?.color || el.getAttribute('color'); // material.color or direct color
        const geometryType = el.tagName.toLowerCase() === 'a-sphere' ? 'sphere' : 'box';

        // This is a simplification: mapping back from a placed object to the original Pattern
        // In a real app, you'd store the patternId or more detailed pattern info when placing the object
        // For now, we'll just use its primary color and geometry as a proxy
        capturedObjects.push({
            id: `obj-${Date.now()}-${index}`, // Simple unique ID
            geometry: geometryType,
            position: { x: position.x, y: position.y, z: position.z },
            patternId: `color-${color}`, // Placeholder patternId
            color1: color,
            style: geometryType === 'sphere' ? 'solid' : 'solid-box' // Simplified style
        });
    });
    console.log("Captured scene data:", capturedObjects);
    return capturedObjects;
}
