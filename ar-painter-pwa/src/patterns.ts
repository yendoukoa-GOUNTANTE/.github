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
export class PatternAI {
  private currentIndex = 0;

  // Suggests the next pattern in a cycle
  suggestPattern(): Pattern {
    const pattern = patternsLibrary[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % patternsLibrary.length;
    return pattern;
  }

  // Suggests a random pattern
  suggestRandomPattern(): Pattern {
    const randomIndex = Math.floor(Math.random() * patternsLibrary.length);
    return patternsLibrary[randomIndex];
  }

  // Get a specific pattern by ID (useful for user selection)
  getPatternById(id: string): Pattern | undefined {
    return patternsLibrary.find(p => p.id === id);
  }
}
