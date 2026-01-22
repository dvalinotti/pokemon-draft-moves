const SPRITE_BASE_URL = 'https://play.pokemonshowdown.com/sprites';

export function getPokemonSpriteUrl(_num: number, id: string): string {
  // Use the Pokemon ID for the sprite URL (works better for forms)
  return `${SPRITE_BASE_URL}/gen5/${id}.png`;
}

export function getPokemonIconUrl(num: number): string {
  // BW icons use Pokedex numbers padded to 3 digits
  const paddedNum = num.toString().padStart(3, '0');
  return `${SPRITE_BASE_URL}/bwicons/${paddedNum}.png`;
}
