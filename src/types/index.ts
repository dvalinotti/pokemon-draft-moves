export interface PokemonData {
  name: string;
  id: string;
  num: number;
}

export interface MoveData {
  name: string;
  id: string;
  type: string;
  category: string;
}

export interface SearchResult {
  pokemon: string;
  learnableMoves: string[];
}

export type SearchLogic = 'AND' | 'OR';

export type InputMode = 'dropdown' | 'paste';

export type GenerationNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface GenerationOption {
  num: GenerationNum;
  label: string;
  shortLabel: string;
}
