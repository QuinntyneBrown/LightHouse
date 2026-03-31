export interface CategoryDefinition {
  name: string;
  slug: string;
  description: string;
  iconName: string;
  sortOrder: number;
}

export const DEFAULT_CATEGORIES: CategoryDefinition[] = [
  {
    name: "Bible Stories",
    slug: "bible-stories",
    description: "Animated and narrated stories from the Bible",
    iconName: "menu_book",
    sortOrder: 1,
  },
  {
    name: "Worship Songs",
    slug: "worship-songs",
    description: "Praise and worship music for children",
    iconName: "music_note",
    sortOrder: 2,
  },
  {
    name: "Prayers",
    slug: "prayers",
    description: "Guided prayers and prayer songs for kids",
    iconName: "volunteer_activism",
    sortOrder: 3,
  },
  {
    name: "Devotionals",
    slug: "devotionals",
    description: "Daily devotional content and reflections",
    iconName: "auto_stories",
    sortOrder: 4,
  },
  {
    name: "Activities",
    slug: "activities",
    description: "Interactive activities, crafts, and games",
    iconName: "palette",
    sortOrder: 5,
  },
];
