import type { SearchLogic, SearchResult } from '../types';

export async function filterPokemonByMoves(
  pokemonList: string[],
  moves: string[],
  logic: SearchLogic,
  canLearn: (pokemon: string, move: string) => Promise<boolean>
): Promise<SearchResult[]> {
  if (moves.length === 0 || pokemonList.length === 0) {
    return [];
  }

  const results: SearchResult[] = [];

  for (const pokemon of pokemonList) {
    const learnableMoves: string[] = [];

    for (const move of moves) {
      const canLearnMove = await canLearn(pokemon, move);
      if (canLearnMove) {
        learnableMoves.push(move);
      }
    }

    const matchesLogic =
      logic === 'AND'
        ? learnableMoves.length === moves.length
        : learnableMoves.length > 0;

    if (matchesLogic) {
      results.push({
        pokemon,
        learnableMoves,
      });
    }
  }

  return results;
}
