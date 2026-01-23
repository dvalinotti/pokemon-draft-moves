const SPRITE_BASE_URL = 'https://play.pokemonshowdown.com/sprites';

// Maps @pkmn/dex IDs to Showdown sprite names when they differ
const ID_TO_SHOWDOWN_SPRITE: Record<string, string> = {
  // Urshifu forms
  'urshifurapidstrike': 'urshifu-rapidstrike',
  // Toxtricity
  'toxtricitylowkey': 'toxtricity-lowkey',
  // Indeedee
  'indeedeef': 'indeedee-f',
  // Basculegion
  'basculegionf': 'basculegion-f',
  // Oinkologne
  'oinkolognef': 'oinkologne-f',
  // Lycanroc
  'lycanrocmidnight': 'lycanroc-midnight',
  'lycanrocdusk': 'lycanroc-dusk',
  // Oricorio
  'oricoriopompom': 'oricorio-pompom',
  'oricoriopau': 'oricorio-pau',
  'oricoriosensu': 'oricorio-sensu',
  // Wormadam
  'wormadamsandy': 'wormadam-sandy',
  'wormadamtrash': 'wormadam-trash',
  // Meowstic
  'meowsticf': 'meowstic-f',
  // Deoxys
  'deoxysattack': 'deoxys-attack',
  'deoxysdefense': 'deoxys-defense',
  'deoxysspeed': 'deoxys-speed',
  // Shaymin
  'shayminsky': 'shaymin-sky',
  // Giratina
  'giratinaorigin': 'giratina-origin',
  // Basculin
  'basculinbluestriped': 'basculin-bluestriped',
  'basculinwhitestriped': 'basculin-whitestriped',
  // Darmanitan
  'darmanitanzen': 'darmanitan-zen',
  'darmanitangalar': 'darmanitan-galar',
  'darmanitangalarzen': 'darmanitan-galarzen',
  // Forces of Nature
  'tornadustherian': 'tornadus-therian',
  'thundurustherian': 'thundurus-therian',
  'landorustherian': 'landorus-therian',
  'enamorustherian': 'enamorus-therian',
  // Keldeo
  'keldeoresolute': 'keldeo-resolute',
  // Meloetta
  'meloettapirouette': 'meloetta-pirouette',
  // Aegislash
  'aegislashblade': 'aegislash-blade',
  // Pumpkaboo/Gourgeist sizes
  'pumpkaboosmall': 'pumpkaboo-small',
  'pumpkaboolarge': 'pumpkaboo-large',
  'pumpkaboosuper': 'pumpkaboo-super',
  'gourgeistsmall': 'gourgeist-small',
  'gourgeistlarge': 'gourgeist-large',
  'gourgeistsuper': 'gourgeist-super',
  // Zygarde
  'zygarde10': 'zygarde-10',
  'zygardecomplete': 'zygarde-complete',
  // Hoopa
  'hoopaunbound': 'hoopa-unbound',
  // Wishiwashi
  'wishiwashischool': 'wishiwashi-school',
  // Minior
  'miniormeteor': 'minior-meteor',
  // Mimikyu
  'mimikyubusted': 'mimikyu-busted',
  // Necrozma
  'necrozmaduskmane': 'necrozma-duskmane',
  'necrozmadawnwings': 'necrozma-dawnwings',
  'necrozmaultra': 'necrozma-ultra',
  // Eiscue
  'eiscuenoice': 'eiscue-noice',
  // Morpeko
  'morpekohangry': 'morpeko-hangry',
  // Zacian/Zamazenta
  'zaciancrowned': 'zacian-crowned',
  'zamazentacrowned': 'zamazenta-crowned',
  // Eternatus
  'eternatuseternmax': 'eternatus-eternamax',
  // Calyrex
  'calyrexice': 'calyrex-ice',
  'calyrexshadow': 'calyrex-shadow',
  // Ogerpon
  'ogerponcornerstone': 'ogerpon-cornerstone',
  'ogerponwellspring': 'ogerpon-wellspring',
  'ogerponhearthflame': 'ogerpon-hearthflame',
  // Terapagos
  'terapagosterastal': 'terapagos-terastal',
  'terapagosstellar': 'terapagos-stellar',
  // Paldean Tauros
  'taboroscombat': 'tauros-paldea-combat',
  'taurospaldeacombat': 'tauros-paldea-combat',
  'taurospaldeablaze': 'tauros-paldea-blaze',
  'taurospaldeaaqua': 'tauros-paldea-aqua',
  // Squawkabilly
  'squawkabillyblue': 'squawkabilly-blue',
  'squawkabillyyellow': 'squawkabilly-yellow',
  'squawkabillywhite': 'squawkabilly-white',
  // Maushold
  'mausholdthree': 'maushold-three', // Actually "mausholdfour" is the default
  // Palafin
  'palafinhero': 'palafin-hero',
  // Dudunsparce
  'dudunsparcethreesegment': 'dudunsparce-threesegment',
  // Gimmighoul
  'gimmighoulroaming': 'gimmighoul-roaming',
};

/**
 * Normalizes a Pokemon ID for Showdown sprite URLs.
 * Removes special characters and handles form variations.
 */
function normalizeForShowdown(id: string): string {
  // First normalize: lowercase, remove special chars except hyphens
  const normalized = id
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[.]/g, '')
    .replace(/[:]/g, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9-]/g, '');

  // Check for direct mapping
  const noHyphens = normalized.replace(/-/g, '');
  if (ID_TO_SHOWDOWN_SPRITE[noHyphens]) {
    return ID_TO_SHOWDOWN_SPRITE[noHyphens];
  }

  // Return the normalized ID (keep hyphens for forms)
  return normalized;
}

export function getPokemonSpriteUrl(_num: number, id: string): string {
  const normalizedId = normalizeForShowdown(id);
  return `${SPRITE_BASE_URL}/gen5/${normalizedId}.png`;
}

export function getPokemonIconUrl(num: number): string {
  // BW icons use Pokedex numbers padded to 3 digits
  const paddedNum = num.toString().padStart(3, '0');
  return `${SPRITE_BASE_URL}/bwicons/${paddedNum}.png`;
}
