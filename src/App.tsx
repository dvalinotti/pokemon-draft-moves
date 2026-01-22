import { useState, useEffect, useCallback } from "react";
import { usePokemonData } from "./hooks/usePokemonData";
import { filterPokemonByMoves } from "./utils/moveChecker";
import { PokemonInput } from "./components/PokemonInput";
import { MoveSearch } from "./components/MoveSearch";
import { LogicToggle } from "./components/LogicToggle";
import { ResultsList } from "./components/ResultsList";
import type { SearchLogic, SearchResult } from "./types";

const STORAGE_KEY = "pokemon-draft-selected";

function loadSelectedPokemon(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return [];
}

function App() {
  const { allPokemon, allMoves, findPokemon, canLearn } = usePokemonData();

  const [selectedPokemon, setSelectedPokemon] =
    useState<string[]>(loadSelectedPokemon);
  const [selectedMoves, setSelectedMoves] = useState<string[]>([]);
  const [searchLogic, setSearchLogic] = useState<SearchLogic>("OR");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async () => {
    if (selectedPokemon.length === 0 || selectedMoves.length === 0) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const searchResults = await filterPokemonByMoves(
        selectedPokemon,
        selectedMoves,
        searchLogic,
        canLearn
      );
      setResults(searchResults);
    } catch (error) {
      console.error("Error performing search:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPokemon, selectedMoves, searchLogic, canLearn]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Persist selected Pokemon to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedPokemon));
  }, [selectedPokemon]);

  return (
    <div className="min-h-screen">
      {/* Marquee Banner */}
      <div className="bg-black py-2 overflow-hidden border-b-4 border-yellow-400">
        <div className="marquee whitespace-nowrap">
          <span className="text-yellow-400 text-lg">
            ★★★ WELCOME TO THE ULTIMATE POKEMON VGC DRAFT MOVE FINDER!!! ★★★ GOTTA CATCH EM ALL!!! ★★★ BEST VIEWED IN NETSCAPE NAVIGATOR ★★★ SIGN MY GUESTBOOK!!! ★★★
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="py-6 text-center border-b-4 border-double border-fuchsia-500" style={{ background: 'linear-gradient(180deg, #ff00ff 0%, #0000ff 50%, #00ffff 100%)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold fire-text mb-2 relative inline-block">
            ✨ Pokemon VGC Draft Move Finder ✨
          </h1>
          <p className="rainbow-text text-xl font-bold mt-2">
            ~*~*~ Find which of your Pokemon can learn specific moves ~*~*~
          </p>
          <div className="mt-2 text-yellow-300 text-sm">
            <span className="blink">🔥 HOT NEW SITE 🔥</span>
            {" | "}
            <span>Visitors: <span className="text-lime-400 font-bold">000{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}</span></span>
            {" | "}
            <span>Last Updated: Jan 2026</span>
          </div>
        </div>
      </header>

      {/* Under Construction Banner */}
      <div className="bg-yellow-400 text-black py-1 text-center border-y-2 border-black flex items-center justify-center gap-4">
        <img src="https://web.archive.org/web/20091027062753im_/http://geocities.com/js_source/warning_icon.gif" alt="warning" className="h-6" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <span className="font-bold">🚧 UNDER CONSTRUCTION 🚧 - More features coming soon!!!</span>
        <img src="https://web.archive.org/web/20091027062753im_/http://geocities.com/js_source/warning_icon.gif" alt="warning" className="h-6" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-8 col-span-2">
            {/* Pokemon Input Panel */}
            <section className="retro-panel p-4">
              <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white text-center py-2 mb-4 border-2 border-black font-bold text-lg">
                📋 YOUR POKEMON LIST 📋
              </div>
              <div className="bg-white border-2 inset p-4" style={{ borderStyle: 'inset' }}>
                <PokemonInput
                  allPokemon={allPokemon}
                  selectedPokemon={selectedPokemon}
                  onPokemonChange={setSelectedPokemon}
                  findPokemon={findPokemon}
                />
              </div>
            </section>

            {/* Cool Links Section */}
            <section className="retro-panel p-4">
              <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 text-white text-center py-2 mb-4 border-2 border-black font-bold">
                🔗 COOL LINKS 🔗
              </div>
              <div className="bg-white border-2 p-3 text-sm space-y-1" style={{ borderStyle: 'inset' }}>
                <p>→ <a href="https://www.smogon.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-red-600 underline">Smogon University</a></p>
                <p>→ <a href="https://pokemonshowdown.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-red-600 underline">Pokemon Showdown</a></p>
                <p>→ <a href="https://bulbapedia.bulbagarden.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-red-600 underline">Bulbapedia</a></p>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-4 col-span-3">
            {/* Move Search Panel */}
            <section className="retro-panel p-4">
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white text-center py-2 mb-4 border-2 border-black font-bold text-lg">
                🔍 MOVE SEARCH 🔍
              </div>
              <div className="bg-white border-2 p-4" style={{ borderStyle: 'inset' }}>
                <MoveSearch
                  allMoves={allMoves}
                  selectedMoves={selectedMoves}
                  onMovesChange={setSelectedMoves}
                />

                {selectedMoves.length > 1 && (
                  <div className="mt-4 p-3 bg-yellow-100 border-2 border-yellow-500">
                    <LogicToggle
                      logic={searchLogic}
                      onLogicChange={setSearchLogic}
                      disabled={isLoading}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Results Panel */}
            <section className="retro-panel p-4">
              <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white text-center py-2 mb-4 border-2 border-black font-bold text-lg">
                ⭐ RESULTS ⭐
              </div>
              <div className="bg-white border-2 p-4" style={{ borderStyle: 'inset' }}>
                <ResultsList
                  results={results}
                  selectedMoves={selectedMoves}
                  logic={searchLogic}
                  isLoading={isLoading}
                  hasSearched={hasSearched}
                  findPokemon={findPokemon}
                />
              </div>
            </section>
          </div>
        </div>

        {/* Guestbook Section */}
        <div className="mt-8 retro-panel p-4 text-center">
          <p className="text-lg font-bold mb-2">📖 SIGN MY GUESTBOOK!! 📖</p>
          <p className="text-sm">(jk this doesn't actually work lol)</p>
          <div className="flex justify-center gap-4 mt-4">
            <img src="https://web.archive.org/web/20091026234846/http://geocities.com/js_source/iecss.gif" alt="ie" className="h-8" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <img src="https://web.archive.org/web/20091026234846/http://geocities.com/js_source/nscss.gif" alt="netscape" className="h-8" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 mt-8 text-center border-t-4 border-double border-fuchsia-500" style={{ background: 'linear-gradient(180deg, #000033 0%, #000066 100%)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-cyan-400 neon-glow mb-2">
            Pokemon data provided by{" "}
            <a
              href="https://github.com/pkmn/ps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fuchsia-400 hover:text-yellow-400 underline"
            >
              @pkmn/dex
            </a>
          </p>
          <p className="text-lime-400 text-sm">Generation 9 (Scarlet/Violet)</p>
          <p className="text-yellow-300 text-xs mt-4">
            Made with 💖 in 2026 | Best viewed at 800x600 resolution
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="text-2xl">🌟</span>
            <span className="text-2xl">⭐</span>
            <span className="text-2xl">✨</span>
            <span className="text-2xl">💫</span>
            <span className="text-2xl">🌟</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
