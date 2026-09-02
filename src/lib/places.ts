// Categorías abiertas: cualquier rubro de negocio local cabe sin romper la UI.
// La versión uno arranca en Santiago de Cuba y escala después.
export type PlaceCategory = string;

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  city: string;
  province: string;
  subcategory: string;
  lat: number;
  lng: number;
  priceLabel: string;
  description: string;
  tags: string[];
  rating: number;
  vibe: string[];
}

// Rubros conocidos + fallback genérico para cualquier negocio nuevo.
export const CATEGORY_META: Record<string, { label: string; emoji: string }> = {
  restaurante: { label: "Restaurante", emoji: "🍽️" },
  bar: { label: "Bar", emoji: "🍹" },
  cafe: { label: "Café", emoji: "☕" },
  takeaway: { label: "Para llevar", emoji: "🥡" },
  tienda: { label: "Tienda", emoji: "🛍️" },
  salud: { label: "Salud & Belleza", emoji: "💇" },
  servicios: { label: "Servicios", emoji: "🛠️" },
  hospedaje: { label: "Hospedaje", emoji: "🏨" },
  naturaleza: { label: "Naturaleza", emoji: "🌿" },
  cultura: { label: "Cultura", emoji: "🎭" },
  playa: { label: "Playa", emoji: "🏖️" },
  transporte: { label: "Transporte", emoji: "🚗" },
  otros: { label: "Negocio local", emoji: "🟢" }
};

// Fallback seguro: cualquier rubro no listado se muestra igual sin romper.
export function categoryMeta(cat: string) {
  return CATEGORY_META[cat] ?? { label: "Negocio local", emoji: "🟢" };
}

// Negocios reales de Santiago de Cuba (municipio) con ubicación verificable.
// Precios: locales privados en CUP (bandas indicativas, casi nadie publica
// lista fija); hoteles y all-inclusive en USD/MLC, que es su moneda aceptada.
// Las coordenadas se anclan a los barrios referidos en cada dirección.
export const PLACES: Place[] = [
  // ── Restaurantes (privados, CUP) ────────────────────────────────
  {
    id: "primos-twice",
    name: "Primos Twice",
    category: "restaurante",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Cocina cubana e internacional",
    lat: 20.0213,
    lng: -75.8235,
    priceLabel: "300–1200 CUP",
    description:
      "Clásico del centro con carta cubana, pastas, pescado y carne. Tercio del paseo de Enramadas, mucho gentío local.",
    tags: ["comer", "restaurante", "cubano", "céntrico", "almuerzo"],
    rating: 4.7,
    vibe: ["Agradable", "Céntrico", "Todo el día"]
  },
  {
    id: "bendita-farandula",
    name: "Restaurante Bendita Farándula",
    category: "restaurante",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Cocina cubana e italiana",
    lat: 20.0225,
    lng: -75.8271,
    priceLabel: "200–900 CUP",
    description:
      "Paladar del casco histórico, platos criollos con toque de horno de leña, cerca de la Calle Heredia.",
    tags: ["comer", "restaurante", "cubano", "italiano", "cena"],
    rating: 4.3,
    vibe: ["Cercano", "Casero", "Noche"]
  },
  {
    id: "la-cabana",
    name: "Restaurante La Cabaña",
    category: "restaurante",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Mariscos y pescado",
    lat: 20.0178,
    lng: -75.8302,
    priceLabel: "400–1500 CUP",
    description:
      "Famoso por mariscos, parrillada de pescado y pulpo. Terraza, parqueo y servicio atento.",
    tags: ["comer", "mariscos", "pescado", "terraza", "cena"],
    rating: 4.9,
    vibe: ["Fresco", "Familiar", "Noche"]
  },
  {
    id: "alo-cubano",
    name: "Alo Cubano",
    category: "restaurante",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Cocina cubana e internacional",
    lat: 20.012,
    lng: -75.8468,
    priceLabel: "400–1800 CUP",
    description:
      "Restaurante interior acondicionado en el Reparto Sueño, buena carta y cócteles. Rincón más tranquilo del demo.",
    tags: ["comer", "restaurante", "cubano", "cócteles", "cena"],
    rating: 4.8,
    vibe: ["Elegante", "Tranquilo", "Noche"]
  },
  {
    id: "st-pauli",
    name: "St. Pauli Restaurant-Bar",
    category: "restaurante",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Cocina cubana y taberna",
    lat: 20.021,
    lng: -75.825,
    priceLabel: "300–1200 CUP",
    description:
      "Bar-restaurante en plena Enramadas: buena comida y ambiente que va subiendo de tono a la noche.",
    tags: ["comer", "restaurante", "bar", "cubano", "noche"],
    rating: 4.3,
    vibe: ["Animado", "Bohemio", "Noche"]
  },
  {
    id: "terraza-padre-pico",
    name: "Terraza Padre Pico",
    category: "restaurante",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Cocina criolla y terraza",
    lat: 20.0195,
    lng: -75.8295,
    priceLabel: "200–900 CUP",
    description:
      "Paladar de la zona de Padre Pico con cocina criolla y música en vivo; más de barrio que de turista.",
    tags: ["comer", "criollo", "música", "terraza", "cena"],
    rating: 4.5,
    vibe: ["Auténtico", "Musical", "Noche"]
  },
  {
    id: "la-caribena",
    name: "La Caribeña",
    category: "restaurante",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Cocina cubana",
    lat: 20.0183,
    lng: -75.8298,
    priceLabel: "250–1000 CUP",
    description:
      "Cocina cubana e internacional en la calle San Carlos, opción económica y céntrica para comer a diario.",
    tags: ["comer", "restaurante", "cubano", "económico", "almuerzo"],
    rating: 4.3,
    vibe: ["Casero", "Céntrico", "Día"]
  },
  {
    id: "el-barracon",
    name: "El Barracón",
    category: "restaurante",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Restaurante y terraza",
    lat: 20.025,
    lng: -75.815,
    priceLabel: "300–1200 CUP",
    description:
      "Restaurante en la Av. Victoriano Garzón e/ 1ra y Aponte, terraza con vista y comida criolla.",
    tags: ["comer", "restaurante", "criollo", "terraza", "noche"],
    rating: 4.4,
    vibe: ["Animado", "Fresco", "Noche"]
  },

  // ── Mercados (CUP) ──────────────────────────────────────────────
  {
    id: "mercado-municipal",
    name: "Mercado Municipal",
    category: "tienda",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Mercado público",
    lat: 20.021,
    lng: -75.831,
    priceLabel: "CUP",
    description:
      "Mercado municipal en Aguilera y Padre Pico: frutas, verduras y productos locales frescos.",
    tags: ["mercado", "frutas", "verduras", "fresco", "día"],
    rating: 4.2,
    vibe: ["Tradicional", "Céntrico", "Día"]
  },
  {
    id: "mercado-artesanal-heredia",
    name: "Mercado artesanal Calle Heredia",
    category: "tienda",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Mercado artesanal",
    lat: 20.021,
    lng: -75.828,
    priceLabel: "CUP / USD",
    description:
      "Mercado artesanal sobre la Calle Heredia, desde Parque Céspedes: artesanías, recuerdos y souvenirs.",
    tags: ["mercado", "artesanía", "souvenirs", "turismo", "día"],
    rating: 4.3,
    vibe: ["Tradicional", "Turístico", "Día"]
  },
  {
    id: "restaurante-aurora",
    name: "Restaurante Aurora",
    category: "restaurante",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Cocina criolla",
    lat: 20.020,
    lng: -75.827,
    priceLabel: "200–800 CUP",
    description:
      "Restaurante criollo en General Portuondo, comida casera santiaguera a buen precio.",
    tags: ["comer", "restaurante", "criollo", "económico", "almuerzo"],
    rating: 4.2,
    vibe: ["Casero", "Tranquilo", "Día"]
  },
  {
    id: "zunzun",
    name: "Zunzún",
    category: "restaurante",
    city: "Vista Alegre",
    province: "Santiago de Cuba",
    subcategory: "Cocina cubana y coctelería",
    lat: 20.0232,
    lng: -75.8172,
    priceLabel: "300–1000 CUP",
    description:
      "Restaurante en Manduley 159, Vista Alegre: cocina cubana con toque moderno y buena carta de cócteles.",
    tags: ["comer", "restaurante", "cubano", "cócteles", "noche"],
    rating: 4.5,
    vibe: ["Moderno", "Animado", "Noche"]
  },
  {
    id: "salon-tropical",
    name: "Salón Tropical",
    category: "restaurante",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Cocina criolla y música",
    lat: 20.018,
    lng: -75.825,
    priceLabel: "200–900 CUP",
    description:
      "Restaurante en Fernández Marcané 310, Reparto Santa Bárbara: comida criolla y música en vivo los fines de semana.",
    tags: ["comer", "criollo", "música", "terraza", "noche"],
    rating: 4.3,
    vibe: ["Musical", "Familiar", "Noche"]
  },

  // ── Bares y cafés (CUP) ─────────────────────────────────────────
  {
    id: "casa-de-la-trova",
    name: "Casa de la Trova 'Pepe Sánchez'",
    category: "bar",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Música y coctelería",
    lat: 20.0231,
    lng: -75.8273,
    priceLabel: "100–600 CUP",
    description:
      "Institución musical de la Calle Heredia: trova y son en vivo cada noche en la cuna de la canción santiaguera. Entrada con cubierto.",
    tags: ["música", "trova", "bar", "cultura", "noche"],
    rating: 4.8,
    vibe: ["Auténtico", "Musical", "Noche"]
  },
  {
    id: "club-led-sports",
    name: "Club LED Sports",
    category: "bar",
    city: "Vista Alegre",
    province: "Santiago de Cuba",
    subcategory: "Bar deportivo y lounge",
    lat: 20.0235,
    lng: -75.8175,
    priceLabel: "200–900 CUP",
    description:
      "Bar lounge con miles de luces LED y pantallas en la Avenida Manduley de Vista Alegre. Copas, música y ambiente.",
    tags: ["bar", "copas", "música", "vista alegre", "noche"],
    rating: 4.7,
    vibe: ["Moderno", "Animado", "Noche"]
  },
  {
    id: "cerveceria-puerto-del-rey",
    name: "Cervecería Puerto del Rey",
    category: "bar",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Cervecería artesanal",
    lat: 20.02,
    lng: -75.838,
    priceLabel: "150–700 CUP",
    description:
      "Cervecería junto a la Avenida Jesús Menéndez, cerca de la bahía. Cerveza fría y picadera junto al puerto.",
    tags: ["cerveza", "bar", "puerto", "copas", "noche"],
    rating: 4.1,
    vibe: ["Relajado", "Fresco", "Noche"]
  },
  {
    id: "coppelia-santiago",
    name: "Heladería Coppelia",
    category: "cafe",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Heladería y café",
    lat: 20.0193,
    lng: -75.8245,
    priceLabel: "50–300 CUP",
    description:
      "La 'Catedral de los helados' santiaguera: helado barato y de calidad en pleno centro, tradición del barrio.",
    tags: ["helado", "café", "barato", "céntrico", "familia"],
    rating: 4.4,
    vibe: ["Clásico", "Familiar", "Día"]
  },
  {
    id: "casa-la-micaela",
    name: "Casa La Micaela",
    category: "cafe",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Café y desayuno",
    lat: 20.0207,
    lng: -75.824,
    priceLabel: "100–500 CUP",
    description:
      "Cafetería al paso entre Enramadas y la calle Corona: café cubano, para llevar y desayunos.",
    tags: ["café", "desayuno", "para llevar", "barato", "día"],
    rating: 4.5,
    vibe: ["Sencillo", "Céntrico", "Día"]
  },

  // ── Hoteles (USD / MLC) ─────────────────────────────────────────
  {
    id: "melia-santiago",
    name: "Meliá Santiago de Cuba",
    category: "hospedaje",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Hotel 5★",
    lat: 20.0263,
    lng: -75.8108,
    priceLabel: "$95–180 USD",
    description:
      "El gran cinco estrellas de la ciudad, en la Av. de las Américas. Piscina, terrazas y vistas de la bahía.",
    tags: ["hotel", "5 estrellas", "piscina", "lujo", "hospedaje"],
    rating: 4.6,
    vibe: ["Elegante", "Confort", "Todo el día"]
  },
  {
    id: "hotel-casa-granda",
    name: "Hotel Casa Granda",
    category: "hospedaje",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Hotel colonial",
    lat: 20.0215,
    lng: -75.8295,
    priceLabel: "$70–120 USD",
    description:
      "Hotel histórico en el Parque Céspedes, con una de las mejores terrazas de la ciudad para ver el atardecer.",
    tags: ["hotel", "colonial", "terraza", "centro", "hospedaje"],
    rating: 4.4,
    vibe: ["Histórico", "Céntrico", "Todo el día"]
  },
  {
    id: "hotel-cubanacan-imperial",
    name: "Hotel Cubanacán Imperial",
    category: "hospedaje",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Hotel céntrico",
    lat: 20.0212,
    lng: -75.8249,
    priceLabel: "$70–120 USD",
    description:
      "Alojamiento en Enramadas esq. Santo Tomás, bien ubicado para caminar todo el casco histórico.",
    tags: ["hotel", "céntrico", "casco", "hospedaje", "urbano"],
    rating: 4.5,
    vibe: ["Céntrico", "Práctico", "Todo el día"]
  },
  {
    id: "hotel-las-americas",
    name: "Hotel Las Américas",
    category: "hospedaje",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Hotel de ciudad",
    lat: 20.0138,
    lng: -75.8298,
    priceLabel: "$50–90 USD",
    description:
      "Hotel en la Av. de las Américas esquina General Cebreco; opción cómoda lejos del trajín del centro.",
    tags: ["hotel", "ciudad", "cómodo", "hospedaje", "avenida"],
    rating: 4.0,
    vibe: ["Tranquilo", "Funcional", "Todo el día"]
  },
  {
    id: "hotel-versalles",
    name: "Hotel Versalles",
    category: "hospedaje",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Hotel en las alturas",
    lat: 20.0261,
    lng: -75.8158,
    priceLabel: "Desde $55 USD",
    description:
      "Hotel en las Alturas de Versalles con vista sobre la ciudad; salir a caminar y respirar la brisa.",
    tags: ["hotel", "alturas", "vista", "hospedaje", "tranquilo"],
    rating: 4.2,
    vibe: ["Sereno", "Panorámico", "Todo el día"]
  },
  {
    id: "hotel-san-juan",
    name: "Hotel San Juan",
    category: "hospedaje",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Hotel en Vista Alegre",
    lat: 20.0000,
    lng: -75.8160,
    priceLabel: "$50–90 USD",
    description:
      "En la carretera de Siboney, barrio de Vista Alegre, a medio camino entre la ciudad y las playas.",
    tags: ["hotel", "vista alegre", "hospedaje", "siboney", "verde"],
    rating: 4.1,
    vibe: ["Verde", "Tranquilo", "Todo el día"]
  },
  {
    id: "hotel-e-san-basilio",
    name: "Hotel E San Basilio",
    category: "hospedaje",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Hotel boutique",
    lat: 20.0188,
    lng: -75.8302,
    priceLabel: "$45–80 USD",
    description:
      "Hotelito boutique en plena calle San Basilio, con patio colonial y trato de casa; a un paso del centro.",
    tags: ["hotel", "boutique", "casco", "hospedaje", "céntrico"],
    rating: 4.5,
    vibe: ["Acogedor", "Histórico", "Todo el día"]
  },

  // ── Cultura, naturaleza y playa (CUP / gratis) ──────────────────
  {
    id: "castillo-del-morro",
    name: "Castillo del Morro San Pedro de la Roca",
    category: "cultura",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Fortaleza histórica",
    lat: 19.9695,
    lng: -75.8661,
    priceLabel: "100 CUP",
    description:
      "Fortaleza del siglo XVII, patrimonio de la humanidad, con vistas espectaculares sobre la bahía.",
    tags: ["historia", "fortaleza", "patrimonio", "vista", "paseo"],
    rating: 4.7,
    vibe: ["Histórico", "Panorámico", "Día"]
  },
  {
    id: "cementerio-santa-ifigenia",
    name: "Cementerio Santa Ifigenia",
    category: "cultura",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Cementerio patrimonial",
    lat: 20.0275,
    lng: -75.8317,
    priceLabel: "200 CUP",
    description:
      "Cementerio-monumento nacional: tumbas de José Martí y Fidel Castro, con cambio de guardia cada media hora.",
    tags: ["historia", "patrimonio", "marti", "paseo", "cultura"],
    rating: 4.6,
    vibe: ["Serio", "Histórico", "Día"]
  },
  {
    id: "casa-de-diego-velazquez",
    name: "Casa de Diego Velázquez",
    category: "cultura",
    city: "Santiago de Cuba",
    province: "Santiago de Cuba",
    subcategory: "Museo de ambiente histórico",
    lat: 20.0197,
    lng: -75.8259,
    priceLabel: "100 CUP",
    description:
      "Una de las casas más antiguas de América, museo de ambiente histórico cubano frente a la Plaza de Marte.",
    tags: ["museo", "historia", "colonial", "cultura", "día"],
    rating: 4.4,
    vibe: ["Educativo", "Histórico", "Día"]
  },
  {
    id: "monumento-gran-piedra",
    name: "Monumento Natural Gran Piedra",
    category: "naturaleza",
    city: "Gran Piedra",
    province: "Santiago de Cuba",
    subcategory: "Montaña y mirador",
    lat: 20.0107,
    lng: -75.6287,
    priceLabel: "50–150 CUP",
    description:
      "Impuesta roca a más de mil metros sobre el mar: cafetales franceses, neblina y vista de la costa sur.",
    tags: ["montaña", "senderismo", "naturaleza", "mirador", "paseo"],
    rating: 4.8,
    vibe: ["Aventura", "Aire libre", "Día"]
  },
  {
    id: "playa-siboney",
    name: "Playa Siboney",
    category: "playa",
    city: "Siboney",
    province: "Santiago de Cuba",
    subcategory: "Playa a 15 min",
    lat: 19.966,
    lng: -75.712,
    priceLabel: "Gratis",
    description:
      "Arenas finas y aguas claras a la salida de la ciudad; la playa del fin de semana de todo Santiago.",
    tags: ["playa", "mar", "sol", "familiar", "arena"],
    rating: 4.6,
    vibe: ["Fresco", "Familiar", "Día"]
  },
  {
    id: "playa-baconao",
    name: "Playa Baconao",
    category: "playa",
    city: "Baconao",
    province: "Santiago de Cuba",
    subcategory: "Playa y parque natural",
    lat: 19.87,
    lng: -75.53,
    priceLabel: "Gratis",
    description:
      "Dentro del Parque Baconao (Reserva de la Biosfera): playa ancha, laguna y la costa del oriente cubano.",
    tags: ["playa", "naturaleza", "laguna", "parque", "biosfera"],
    rating: 4.4,
    vibe: ["Natural", "Espacioso", "Día"]
  }
];

export function placesByCity(city: string): Place[] {
  return PLACES.filter((p) => p.city === city);
}

// Vitrina del mapa: 9 negocios reales con coordenadas del archivo negocios_santiago_cuba.md
export const FEATURED_PLACES: Place[] = [
  requirePlace("hotel-casa-granda"),
  requirePlace("melia-santiago"),
  requirePlace("st-pauli"),
  requirePlace("el-barracon"),
  requirePlace("mercado-municipal"),
  requirePlace("mercado-artesanal-heredia"),
  requirePlace("restaurante-aurora"),
  requirePlace("zunzun"),
  requirePlace("salon-tropical")
];

function requirePlace(id: string): Place {
  const p = findPlace(id);
  if (!p) throw new Error(`Lugar destacado "${id}" no encontrado`);
  return p;
}

export function findPlace(path: string): Place | undefined {
  return PLACES.find((p) => p.id === path);
}

// Resumen de cobertura para el hero (autocalculado)
export const SITE_STATS = {
  places: PLACES.length,
  cities: new Set(PLACES.map((p) => p.province)).size
};
