export const PROVINCIAS = [
  "Pinar del Río",
  "Artemisa",
  "La Habana",
  "Mayabeque",
  "Matanzas",
  "Cienfuegos",
  "Villa Clara",
  "Sancti Spíritus",
  "Ciego de Ávila",
  "Camagüey",
  "Las Tunas",
  "Holguín",
  "Granma",
  "Santiago de Cuba",
  "Guantánamo",
  "Isla de la Juventud"
] as const;

export type Provincia = (typeof PROVINCIAS)[number];

export function isProvincia(value: string): value is Provincia {
  return (PROVINCIAS as readonly string[]).includes(value);
}