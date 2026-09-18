/**
 * Menú y paquetes de catering: la única fuente de nombres, descripciones y
 * precios. build/html.ts lo convierte en HTML al compilar (portada, /menu y
 * catering) y api/solicitud.ts lo usa para recalcular el total en el servidor.
 *
 * Las especialidades y los paquetes son los que ya tenía el sitio. La carta
 * (tacos, antojitos, bebidas…) es un MENÚ DE EJEMPLO inventado para el
 * proyecto: sustitúyelo por el real cuando exista.
 */

export type Tag = "vegetariano" | "vegano" | "picante";

/** Nombre del icono en public/icons.svg. */
export type Icon =
  | "taco"
  | "leaf"
  | "corn"
  | "cup"
  | "flan"
  | "utensils"
  | "glass"
  | "party"
  | "cloche"
  | "truck"
  | "pin";

export interface Dish {
  name: string;
  description: string;
  price: number;
  tags: Tag[];
}

export interface Special extends Dish {
  image: { src: string; alt: string; width: number; height: number };
  /** Ingredientes que se muestran como píldoras en /menu. */
  highlights: string[];
}

export interface Category {
  id: string;
  title: string;
  note: string;
  icon: Icon;
  dishes: Dish[];
}

export interface CateringPackage {
  /** Valor que se envía en el formulario (name="catering"). */
  name: string;
  pricePerPerson: number;
  icon: Icon;
  summary: string;
  features: string[];
  featuredLabel?: string;
}

export const specials: Special[] = [
  {
    name: "El Taco-Liz",
    description:
      "Tierna carne o pollo sazonado, con cilantro y cebolla fresca en una tortilla calientita. Servido con salsa de la casa.",
    price: 2.35,
    tags: [],
    image: { src: "/photos/rsz_11rsz_1taco2.png", alt: "Taco El Taco-Liz", width: 128, height: 128 },
    highlights: ["Carne o pollo", "Cilantro y cebolla", "Salsa de la casa"],
  },
  {
    name: "El Burrito-Sabanero",
    description:
      "Relleno de tu carne favorita, arroz, frijoles refritos y queso fundido. Con salsa y crema. Un platillo que llena y encanta.",
    price: 4.0,
    tags: [],
    image: { src: "/photos/rsz_1rsz_1burrito.png", alt: "Burrito El Burrito-Sabanero", width: 160, height: 128 },
    highlights: ["Arroz y frijoles", "Queso fundido", "Salsa y crema"],
  },
  {
    name: "El Nacho-licious",
    description:
      "Totopos crujientes con queso fundido y carne o pollo. Con pico de gallo, guacamole y crema. El antojo perfecto.",
    price: 4.25,
    tags: [],
    image: { src: "/photos/rsz_1rsz_1nachos.png", alt: "Nachos El Nacho-licious", width: 128, height: 128 },
    highlights: ["Totopos", "Pico de gallo", "Guacamole y crema"],
  },
];

const V: Tag = "vegetariano";
const VG: Tag = "vegano";
const P: Tag = "picante";

export const carta: Category[] = [
  {
    id: "tacos",
    title: "Tacos",
    note: "Por pieza, en tortilla de maíz hecha al momento.",
    icon: "taco",
    dishes: [
      { name: "Al pastor", description: "Cerdo adobado al trompo con piña, cebolla y cilantro.", price: 2.5, tags: [] },
      { name: "Carne asada", description: "Res a la parrilla con cebolla asada y un toque de guacamole.", price: 2.75, tags: [] },
      { name: "Pollo al achiote", description: "Pollo marinado en achiote con cebolla morada encurtida.", price: 2.25, tags: [] },
      { name: "Cochinita pibil", description: "Cerdo cocido lento en achiote, con cebolla morada y habanero.", price: 2.75, tags: [P] },
      { name: "Suadero", description: "Res suave y doradita, con salsa verde de la casa.", price: 2.5, tags: [] },
      { name: "Campechano", description: "Asada, chorizo y chicharrón en el mismo taco.", price: 2.75, tags: [] },
    ],
  },
  {
    id: "vegetariano",
    title: "Vegetariano y vegano",
    note: "Mismo sabor de taquería, sin carne.",
    icon: "leaf",
    dishes: [
      { name: "Hongos al ajillo", description: "Hongos salteados con ajo, epazote y chile guajillo.", price: 2.25, tags: [V, VG] },
      { name: "Coliflor al pastor", description: "Coliflor en adobo de pastor con piña asada.", price: 2.25, tags: [V, VG, P] },
      { name: "Nopal con queso", description: "Nopal a la plancha con queso asadero y pico de gallo.", price: 2.25, tags: [V] },
      { name: "Quesadilla de flor de calabaza", description: "Tortilla de maíz con queso Oaxaca y flor de calabaza.", price: 3.5, tags: [V] },
    ],
  },
  {
    id: "antojitos",
    title: "Antojitos",
    note: "Para compartir al centro de la mesa.",
    icon: "corn",
    dishes: [
      { name: "Gringa al pastor", description: "Tortilla de harina con queso fundido, pastor y piña.", price: 4.5, tags: [] },
      { name: "Panuchos (2)", description: "Tortilla rellena de frijol con cochinita, lechuga y cebolla morada.", price: 4.5, tags: [] },
      { name: "Sopes (2)", description: "Base de masa con frijoles, carne a elegir, lechuga, crema y queso.", price: 4.25, tags: [] },
      { name: "Esquites", description: "Elote desgranado con mayonesa, limón, queso y chile en polvo.", price: 3.0, tags: [V] },
    ],
  },
  {
    id: "bebidas",
    title: "Bebidas",
    note: "Aguas frescas hechas cada mañana.",
    icon: "cup",
    dishes: [
      { name: "Horchata", description: "Agua de arroz con canela.", price: 2.25, tags: [V] },
      { name: "Agua de jamaica", description: "De flor de jamaica, poco dulce.", price: 2.25, tags: [V, VG] },
      { name: "Agua de tamarindo", description: "Tamarindo natural.", price: 2.25, tags: [V, VG] },
      { name: "Limonada con chía", description: "Limón recién exprimido con semillas de chía.", price: 2.5, tags: [V, VG] },
      { name: "Refresco de vidrio", description: "Pregunta por los sabores del día.", price: 2.0, tags: [V, VG] },
    ],
  },
  {
    id: "postres",
    title: "Postres",
    note: "Porque siempre hay espacio.",
    icon: "flan",
    dishes: [
      { name: "Churros con cajeta", description: "Tres churros con azúcar y canela, y cajeta para mojar.", price: 3.25, tags: [V] },
      { name: "Flan napolitano", description: "Flan de la casa con caramelo.", price: 3.0, tags: [V] },
      { name: "Arroz con leche", description: "Con canela y pasas.", price: 2.75, tags: [V] },
    ],
  },
  {
    id: "acompanantes",
    title: "Para acompañar",
    note: "Las salsas de la casa van incluidas.",
    icon: "utensils",
    dishes: [
      { name: "Guacamole con totopos", description: "Aguacate, cebolla, cilantro y limón.", price: 3.5, tags: [V, VG] },
      { name: "Frijoles charros", description: "Frijol bayo con tocino, chorizo y chile.", price: 2.5, tags: [] },
      { name: "Pico de gallo", description: "Jitomate, cebolla, cilantro y chile serrano.", price: 1.5, tags: [V, VG] },
      { name: "Salsa extra picante", description: "Habanero tatemado de la casa.", price: 0.75, tags: [V, VG, P] },
    ],
  },
];

export const cateringPackages: CateringPackage[] = [
  {
    name: "Buffet",
    pricePerPerson: 18,
    icon: "taco",
    summary: "Variedad y servicio relajado tipo bufé.",
    features: ["Tacos al pastor, asada y pollo", "Guarniciones y salsas de la casa", "Aguas frescas ilimitadas"],
  },
  {
    name: "Comida formal",
    pricePerPerson: 32,
    icon: "glass",
    summary: "Menú servido en mesa, de tres tiempos.",
    features: ["Entrada, plato fuerte y postre", "Meseras y servicio en mesa", "Vajilla y mantelería incluidas"],
    featuredLabel: "Más popular",
  },
  {
    name: "Cena temática",
    pricePerPerson: 42,
    icon: "party",
    summary: "Experiencia mexicana completa.",
    features: ["Ambientación y decoración temática", "Barra de aguas frescas y antojitos", "Música en vivo (opcional)"],
  },
];

/** Reglas del formulario de catering compartidas por el HTML y el servidor. */
export const cateringRules = {
  minGuests: 20,
  waitresses: { min: 3, max: 7 },
  maxAddons: 2,
  addons: [
    { value: "servilletas-de-lujo", label: "Servilletas de lujo" },
    { value: "utensilios-de-lujo", label: "Utensilios de lujo" },
    { value: "salsa-picante", label: "Salsa extra picante" },
    { value: "guacamole-extra", label: "Guacamole extra" },
  ],
  colonias: ["San Ramón Norte I", "Montes de Ame", "Santa Gertrudis Copo", "Montebello"],
} as const;

/** Formato de precio del sitio: $2.35, $1,280 (sin decimales si son enteros). */
export const money = (n: number, decimals = 2): string =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
