export enum CharacterType {
  HUNTER = 'Hunter',
  SHADOW = 'Shadow',
  MONSTER = 'Monster',
  RULER = 'Ruler',
  MONARCH = 'Monarch',
  OTHER = 'Other',
}

export enum CharacterRank {
  S_RANK = 'S-Rank',
  A_RANK = 'A-Rank',
  B_RANK = 'B-Rank',
  C_RANK = 'C-Rank',
  D_RANK = 'D-Rank',
  E_RANK = 'E-Rank',
  NATIONAL_LEVEL = 'National Level Hunter', // Specific to some hunters
  MONARCH_RANK = 'Monarch', // For Monarchs
  RULER_RANK = 'Ruler',     // For Rulers
  UNKNOWN = 'Unknown',
  NONE = 'None', // For entities that don't have a rank like some monsters
}

export interface CharacterStats {
  // Using optional fields as not all characters might have defined stats
  // or stats might vary significantly in structure.
  strength?: number | string;
  agility?: number | string;
  vitality?: number | string;
  intelligence?: number | string;
  perception?: number | string;
  mana?: number | string;
  stamina?: number | string;
  [key: string]: any; // For any other specific stats
}

export interface Character {
  id: string; // Unique ID, can be a slug or number
  name: string;
  alias?: string[];
  imageUrl?: string; // URL to the character's image
  description: string;
  type: CharacterType;
  rank?: CharacterRank; // Rank might not apply to all types or be unknown
  abilities: string[];
  skills?: string[]; // Specific named skills
  equipment?: string[]; // Notable equipment
  stats?: CharacterStats;
  notes?: string; // Any extra information or trivia
  firstAppearance?: string; // e.g., "Chapter 1 (Manhwa)" or "Episode 1 (Anime)"
  status?: 'Alive' | 'Deceased' | 'Unknown' | 'Undead';
}
