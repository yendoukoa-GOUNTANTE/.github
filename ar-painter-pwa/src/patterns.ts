export type PatternStyle = 'solid' | 'stripes' | 'polka-dots' | 'gradient';

export interface Pattern {
  id: string;
  name: string;
  style: PatternStyle;
  description: string;
  // For procedural patterns, we might have parameters
  // For texture-based, a URL to the texture
  // For simplicity, we'll focus on style and basic parameters like colors for now
  color1: string; // Primary color for solid, stripes, dots, gradient start
  color2?: string; // Secondary color for stripes, gradient end
}

export const patternsLibrary: Pattern[] = [
  {
    id: 'solid-red',
    name: 'Solid Red',
    style: 'solid',
    description: 'A simple solid red color.',
    color1: 'red'
  },
  {
    id: 'solid-blue',
    name: 'Solid Blue',
    style: 'solid',
    description: 'A simple solid blue color.',
    color1: 'blue'
  },
  {
    id: 'bw-stripes',
    name: 'B&W Stripes',
    style: 'stripes',
    description: 'Black and white vertical stripes.',
    color1: 'black',
    color2: 'white'
  },
  {
    id: 'red-yellow-dots',
    name: 'Red/Yellow Dots',
    style: 'polka-dots',
    description: 'Red background with yellow dots.',
    color1: 'red', // background
    color2: 'yellow' // dot color
  },
  {
    id: 'blue-green-gradient',
    name: 'Blue-Green Gradient',
    style: 'gradient',
    description: 'A gradient from blue to green.',
    color1: 'blue',
    color2: 'green'
  }
];

// Simple AI for pattern suggestion

// New library for AI-exclusive suggestions when premium is active
export const premiumAIPatternsLibrary: Pattern[] = [
  {
    id: 'ai-exclusive-aurora',
    name: 'AI: Aurora Borealis',
    style: 'gradient',
    description: 'A flowing, multi-color gradient inspired by the northern lights.',
    color1: '#3ddde0', // teal
    color2: '#9c4ad0'  // purple
  },
  {
    id: 'ai-exclusive-circuit',
    name: 'AI: Cyber Circuit',
    style: 'stripes', // Represented as complex stripes/lines
    description: 'Glowing, intricate circuit board lines.',
    color1: '#00ff00', // bright green
    color2: '#005000'  // dark green
  },
];


export class PatternAI {
  private suggestionCycleIndex = 0;

  // Suggests a pattern, potentially from an expanded set if premium AI is active.
  suggestPattern(
    currentSelectedPattern: Pattern, // For context, not used in this basic version yet
    availableToUserPatterns: Pattern[], // Patterns user owns or are free
    hasPremiumAIAccess: boolean = false
  ): Pattern {
    let combinedPool = [...availableToUserPatterns];
    if (hasPremiumAIAccess) {
      combinedPool = [...combinedPool, ...premiumAIPatternsLibrary];
    }

    if (combinedPool.length === 0) { // Should not happen if patternsLibrary is not empty
        return patternsLibrary[0] || {id:'fallback', name:'Fallback', style:'solid', color1:'grey', description:'Fallback pattern'};
    }

    // Simple cycling for PoC to ensure all types of suggestions are seen
    this.suggestionCycleIndex = (this.suggestionCycleIndex + 1) % combinedPool.length;
    const suggested = combinedPool[this.suggestionCycleIndex];

    // Avoid suggesting the exact same pattern that is currently selected, if possible and pool is larger
    if (combinedPool.length > 1 && suggested.id === currentSelectedPattern.id) {
        this.suggestionCycleIndex = (this.suggestionCycleIndex + 1) % combinedPool.length;
        return combinedPool[this.suggestionCycleIndex];
    }
    return suggested;
  }

  // Get a specific pattern by ID (useful for user selection from combined list)
  getPatternById(id: string, availableToUserPatterns: Pattern[], hasPremiumAIAccess: boolean = false): Pattern | undefined {
    let combinedPool = [...availableToUserPatterns];
    if (hasPremiumAIAccess) {
      combinedPool = [...combinedPool, ...premiumAIPatternsLibrary];
    }
    return combinedPool.find(p => p.id === id);
  }
}
