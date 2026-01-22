import { useMemo, useCallback } from 'react';
import { Dex } from '@pkmn/dex';
import { Generations } from '@pkmn/data';
import type { PokemonData, MoveData } from '../types';

const generations = new Generations(Dex);
const gen9 = generations.get(9);

export function usePokemonData() {
  const allPokemon = useMemo<PokemonData[]>(() => {
    const species = Array.from(gen9.species);
    return species
      .filter(s => !s.isNonstandard && s.exists)
      .map(s => ({
        name: s.name,
        id: s.id,
        num: s.num,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const allMoves = useMemo<MoveData[]>(() => {
    const moves = Array.from(gen9.moves);
    return moves
      .filter(m => !m.isNonstandard && m.exists)
      .map(m => ({
        name: m.name,
        id: m.id,
        type: m.type,
        category: m.category,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

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

      const learnsets = gen9.learnsets;
      const result = await learnsets.canLearn(pokemon.name, move.name);
      return result;
    } catch {
      return false;
    }
  }, [allPokemon, allMoves]);

  return {
    allPokemon,
    allMoves,
    findPokemon,
    findMove,
    canLearn,
  };
}
