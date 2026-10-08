export const SITE = { name: "The Walkthrough AI", domain: "thewalkthroughai.com", rate: 250, rateUnit: 2500 } as const;
export type SectorId = "real-estate" | "resorts" | "golf";
export const SECTORS: {id: SectorId; label: string; kicker: string; image: string; alt: string}[] = [
  {id: "real-estate", label: "Real estate", kicker: "Listings · Interior + exterior", image: "/images/sector-real-estate.png", alt: "Dusk interior of a contemporary home looking through to a glass wall"},
  {id: "resorts", label: "Resorts & hotels", kicker: "Suites · Grounds · Amenities", image: "/images/sector-resorts.png", alt: "Resort suite looking out to a private plunge pool and the sea"},
  {id: "golf", label: "Golf courses", kicker: "Fairways · Greens · Grounds", image: "/images/sector-golf.png", alt: "Aerial perspective down a golf fairway beside a lake at golden hour"},
];
export const REVEALS = [
  {id: "staging", kicker: "Interior · Virtual staging", title: "Empty rooms don't sell the feeling.", before: "/images/stage-before.png", after: "/images/stage-after.png", beforeLabel: "Unfurnished", afterLabel: "AI staged", hint: "Drag to compare"},
  {id: "dusk", kicker: "Exterior · Day to dusk", title: "A different light. A different impression.", before: "/images/dusk-before.png", after: "/images/dusk-after.png", beforeLabel: "Daytime", afterLabel: "AI twilight", hint: "Drag to compare"},
];
export const CAPABILITIES = ["Walkable 3D tour", "Aerial flyover", "Virtual staging", "Furniture removal", "Room declutter", "Day to dusk", "Natural twilight", "Photo enhance", "Material overlay", "Season change", "Weather change", "Lawn replacement", "Pool water", "Night to day"];
export const FEATURE_OPTIONS = ["Walkable 3D tour", "Aerial flyover", "Virtual staging", "Day to dusk", "Declutter", "Photo enhance"] as const;
export const FAQS = [{q: "What do you actually need from us?"}];