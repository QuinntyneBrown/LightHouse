export interface AgeBandDefinition {
  key: string;
  label: string;
  minAge: number;
  maxAge: number;
  description: string;
}

export const AGE_BANDS: AgeBandDefinition[] = [
  {
    key: "BABY",
    label: "Baby",
    minAge: 0,
    maxAge: 2,
    description: "Ages 0-2: Simple visuals, lullabies, and gentle content",
  },
  {
    key: "TODDLER",
    label: "Toddler",
    minAge: 2,
    maxAge: 4,
    description: "Ages 2-4: Short stories, sing-alongs, and basic Bible concepts",
  },
  {
    key: "PRESCHOOL",
    label: "Preschool",
    minAge: 4,
    maxAge: 6,
    description: "Ages 4-6: Bible stories, worship songs, and interactive activities",
  },
  {
    key: "EARLY_READER",
    label: "Early Reader",
    minAge: 6,
    maxAge: 9,
    description: "Ages 6-9: Deeper Bible stories, devotionals, and memory verses",
  },
];

export function getAgeBandForAge(age: number): string | null {
  const band = AGE_BANDS.find((b) => age >= b.minAge && age < b.maxAge);
  return band?.key ?? null;
}
