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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Checking move compatibility...</span>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Add Pokemon and search for moves to see results</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No Pokemon found that can learn {logic === 'AND' ? 'all' : 'any'} of the selected moves</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Results ({results.length} Pokemon)
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map(result => {
          const pokemonData = findPokemon(result.pokemon);
          return (
            <div
              key={result.pokemon}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
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
                <h3 className="font-semibold text-gray-800">{result.pokemon}</h3>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500">Can learn:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedMoves.map(move => {
                    const canLearnMove = result.learnableMoves.includes(move);
                    return (
                      <span
                        key={move}
                        className={`px-2 py-0.5 rounded text-xs ${
                          canLearnMove
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {canLearnMove ? '\u2713' : '\u2717'} {move}
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
