import type { SearchResult, SearchLogic, PokemonData } from '../types';
import { getPokemonSpriteUrl } from '../utils/sprites';

interface ResultsListProps {
  results: SearchResult[];
  selectedMoves: string[];
  logic: SearchLogic;
  isLoading: boolean;
  hasSearched: boolean;
  findPokemon: (name: string) => PokemonData | undefined;
}

export function ResultsList({
  results,
  selectedMoves,
  logic,
  isLoading,
  hasSearched,
  findPokemon,
}: ResultsListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-4xl animate-bounce">⏳</div>
        <span className="mt-3 text-fuchsia-700 font-bold blink">Loading... Please wait!!</span>
        <div className="mt-2 text-2xl">🔄</div>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🤔</div>
        <p className="text-blue-700 font-bold text-lg">Add Pokemon and search for moves to see results!!</p>
        <p className="text-fuchsia-600 mt-2">↑↑↑ Use the forms above ↑↑↑</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😢</div>
        <p className="text-red-600 font-bold text-lg">No Pokemon found that can learn {logic === 'AND' ? 'ALL' : 'ANY'} of the selected moves!!</p>
        <p className="text-gray-600 mt-2">Try different moves or add more Pokemon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center bg-gradient-to-r from-lime-400 via-green-400 to-lime-400 border-2 border-black py-2">
        <h2 className="text-lg font-bold text-black">
          🎊 FOUND {results.length} POKEMON!! 🎊
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {results.map(result => {
          const pokemonData = findPokemon(result.pokemon);
          return (
            <div
              key={result.pokemon}
              className="bg-gradient-to-b from-white to-gray-100 border-2 border-black p-3 shadow-[3px_3px_0_#000] hover:shadow-[5px_5px_0_#000] transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2 bg-gradient-to-r from-cyan-200 to-cyan-300 border-b-2 border-black p-2 -mx-3 -mt-3">
                {pokemonData && (
                  <img
                    src={getPokemonSpriteUrl(pokemonData.num, pokemonData.id)}
                    alt={result.pokemon}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <h3 className="font-bold text-blue-800 text-lg">★ {result.pokemon} ★</h3>
              </div>
              <div className="space-y-1 mt-2">
                <span className="text-xs font-bold text-gray-700">Moves:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedMoves.map(move => {
                    const canLearnMove = result.learnableMoves.includes(move);
                    return (
                      <span
                        key={move}
                        className={`px-2 py-0.5 border border-black text-xs font-bold ${
                          canLearnMove
                            ? 'bg-lime-300 text-green-900'
                            : 'bg-red-300 text-red-900'
                        }`}
                      >
                        {canLearnMove ? '✓' : '✗'} {move}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
