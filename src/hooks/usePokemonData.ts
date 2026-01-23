import { useMemo, useCallback } from 'react';
import { Dex } from '@pkmn/dex';
import { Generations } from '@pkmn/data';
import type { PokemonData, MoveData, GenerationNum } from '../types';

const generations = new Generations(Dex);

export function usePokemonData(generationNum: GenerationNum = 9) {
  const gen = useMemo(() => generations.get(generationNum), [generationNum]);

  const allPokemon = useMemo<PokemonData[]>(() => {
    const species = Array.from(gen.species);
    return species
      .filter(s => !s.isNonstandard && s.exists)
      .map(s => ({
        name: s.name,
        id: s.id,
        num: s.num,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [gen]);

  const allMoves = useMemo<MoveData[]>(() => {
    const moves = Array.from(gen.moves);
    return moves
      .filter(m => !m.isNonstandard && m.exists)
      .map(m => ({
        name: m.name,
        id: m.id,
        type: m.type,
        category: m.category,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [gen]);

  const findPokemon = useCallback((query: string): PokemonData | undefined => {
    const normalized = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    return allPokemon.find(p => p.id === normalized || p.name.toLowerCase() === query.toLowerCase());
  }, [allPokemon]);

  const findMove = useCallback((query: string): MoveData | undefined => {
    const normalized = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    return allMoves.find(m => m.id === normalized || m.name.toLowerCase() === query.toLowerCase());
  }, [allMoves]);

  const canLearn = useCallback(async (pokemonName: string, moveName: string): Promise<boolean> => {
    try {
      const normalized = pokemonName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const pokemon = allPokemon.find(p => p.id === normalized || p.name.toLowerCase() === pokemonName.toLowerCase());

      const normalizedMove = moveName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const move = allMoves.find(m => m.id === normalizedMove || m.name.toLowerCase() === moveName.toLowerCase());

      if (!pokemon || !move) return false;

      // Get the learnset and check for sources from the selected generation
      const learnset = await gen.learnsets.get(pokemon.name);
      if (!learnset?.learnset) return false;

      const moveId = move.id;
      const sources = learnset.learnset[moveId];

      if (!sources || !Array.isArray(sources)) return false;

      // Check if any source starts with the generation number
      // Sources are encoded like: 9M (TM), 9L10 (Level 10), 9E (Egg), 9T (Tutor), 9S (Special/Event)
      const genPrefix = String(generationNum);
      const hasGenSource = sources.some(source => source.startsWith(genPrefix));
      return hasGenSource;
    } catch {
      return false;
    }
  }, [allPokemon, allMoves, gen, generationNum]);

  return {
    allPokemon,
    allMoves,
    findPokemon,
    findMove,
    canLearn,
  };
}
