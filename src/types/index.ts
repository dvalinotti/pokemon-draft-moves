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
