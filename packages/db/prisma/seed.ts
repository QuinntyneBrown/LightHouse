import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding LightHouse Kids database...");

  // ── Categories ──────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "bible-stories" },
      create: {
        name: "Bible Stories",
        slug: "bible-stories",
        description: "Animated and narrated stories from the Bible",
        iconName: "menu_book",
        sortOrder: 1,
      },
      update: {},
    }),
    prisma.category.upsert({
      where: { slug: "worship-songs" },
      create: {
        name: "Worship Songs",
        slug: "worship-songs",
        description: "Praise and worship music for children",
        iconName: "music_note",
        sortOrder: 2,
      },
      update: {},
    }),
    prisma.category.upsert({
      where: { slug: "prayers" },
      create: {
        name: "Prayers",
        slug: "prayers",
        description: "Guided prayers and prayer songs for kids",
        iconName: "volunteer_activism",
        sortOrder: 3,
      },
      update: {},
    }),
    prisma.category.upsert({
      where: { slug: "devotionals" },
      create: {
        name: "Devotionals",
        slug: "devotionals",
        description: "Daily devotional content and reflections",
        iconName: "auto_stories",
        sortOrder: 4,
      },
      update: {},
    }),
    prisma.category.upsert({
      where: { slug: "activities" },
      create: {
        name: "Activities",
        slug: "activities",
        description: "Interactive activities, crafts, and games",
        iconName: "palette",
        sortOrder: 5,
      },
      update: {},
    }),
  ]);

  console.log(`  Created ${categories.length} categories`);

  // ── Avatars ─────────────────────────────────────────────────────────
  const avatarData = [
    { name: "Little Lamb", icon: "child_care", color: "#FF7043" },
    { name: "Faithful Friend", icon: "pets", color: "#66BB6A" },
    { name: "Shining Star", icon: "star", color: "#AB47BC" },
    { name: "Sunny Day", icon: "wb_sunny", color: "#FFD54F" },
    { name: "Sailor", icon: "sailing", color: "#42A5F5" },
    { name: "Garden Flower", icon: "local_florist", color: "#EC407A" },
  ];

  const avatars = await Promise.all(
    avatarData.map((a) =>
      prisma.avatar.upsert({
        where: { id: a.name }, // Will fail on first run, use create
        create: a,
        update: {},
      }).catch(() =>
        prisma.avatar.create({ data: a })
      )
    )
  );

  console.log(`  Created ${avatars.length} avatars`);

  // ── Sample Content ──────────────────────────────────────────────────
  const [bibleStories, worshipSongs, prayers, devotionals, activities] = categories;

  const contentItems = [
    {
      title: "David and Goliath",
      description: "The brave young shepherd David faces the giant Goliath with faith and a sling.",
      contentType: "VIDEO" as const,
      status: "PUBLISHED" as const,
      durationSeconds: 720,
      isFeatured: true,
      publishedAt: new Date(),
      ageBands: ["PRESCHOOL", "EARLY_READER"] as const,
      categoryId: bibleStories.id,
      tags: ["courage", "faith", "david"],
    },
    {
      title: "Noah's Ark",
      description: "Noah builds a big boat and saves the animals as God instructed.",
      contentType: "VIDEO" as const,
      status: "PUBLISHED" as const,
      durationSeconds: 600,
      isFeatured: true,
      publishedAt: new Date(),
      ageBands: ["TODDLER", "PRESCHOOL"] as const,
      categoryId: bibleStories.id,
      tags: ["noah", "animals", "obedience"],
    },
    {
      title: "Jesus Loves Me",
      description: "A beautiful rendition of the classic children's hymn.",
      contentType: "AUDIO" as const,
      status: "PUBLISHED" as const,
      durationSeconds: 180,
      isFeatured: false,
      publishedAt: new Date(),
      ageBands: ["BABY", "TODDLER"] as const,
      categoryId: worshipSongs.id,
      tags: ["hymn", "love", "jesus"],
    },
    {
      title: "This Little Light of Mine",
      description: "Sing along to this joyful song about shining God's light.",
      contentType: "AUDIO" as const,
      status: "PUBLISHED" as const,
      durationSeconds: 210,
      isFeatured: true,
      publishedAt: new Date(),
      ageBands: ["TODDLER", "PRESCHOOL", "EARLY_READER"] as const,
      categoryId: worshipSongs.id,
      tags: ["sing-along", "light", "joy"],
    },
    {
      title: "Bedtime Prayer for Little Ones",
      description: "A gentle guided prayer to end the day with God.",
      contentType: "AUDIO" as const,
      status: "PUBLISHED" as const,
      durationSeconds: 120,
      isFeatured: false,
      publishedAt: new Date(),
      ageBands: ["BABY", "TODDLER"] as const,
      categoryId: prayers.id,
      tags: ["bedtime", "prayer", "gentle"],
    },
    {
      title: "Thank You God Prayer",
      description: "Learn to thank God for the blessings in your life.",
      contentType: "INTERACTIVE" as const,
      status: "PUBLISHED" as const,
      durationSeconds: 300,
      isFeatured: false,
      publishedAt: new Date(),
      ageBands: ["PRESCHOOL", "EARLY_READER"] as const,
      categoryId: prayers.id,
      tags: ["gratitude", "prayer", "interactive"],
    },
    {
      title: "God Made Everything",
      description: "A daily devotional about God's wonderful creation.",
      contentType: "READ_ALONG" as const,
      status: "PUBLISHED" as const,
      durationSeconds: 360,
      isFeatured: false,
      publishedAt: new Date(),
      ageBands: ["PRESCHOOL", "EARLY_READER"] as const,
      categoryId: devotionals.id,
      tags: ["creation", "devotional", "nature"],
    },
    {
      title: "Joseph's Colorful Coat",
      description: "The story of Joseph and his amazing coat of many colors.",
      contentType: "VIDEO" as const,
      status: "PUBLISHED" as const,
      durationSeconds: 540,
      isFeatured: true,
      publishedAt: new Date(),
      ageBands: ["PRESCHOOL", "EARLY_READER"] as const,
      categoryId: bibleStories.id,
      tags: ["joseph", "dreams", "forgiveness"],
    },
    {
      title: "Color the Creation",
      description: "Interactive coloring activity based on the creation story.",
      contentType: "INTERACTIVE" as const,
      status: "PUBLISHED" as const,
      durationSeconds: 0,
      isFeatured: false,
      publishedAt: new Date(),
      ageBands: ["TODDLER", "PRESCHOOL"] as const,
      categoryId: activities.id,
      tags: ["coloring", "creation", "interactive"],
    },
    {
      title: "Baby Lullaby Psalms",
      description: "Gentle psalms set to soothing lullaby music for babies.",
      contentType: "AUDIO" as const,
      status: "PUBLISHED" as const,
      durationSeconds: 900,
      isFeatured: false,
      publishedAt: new Date(),
      ageBands: ["BABY"] as const,
      categoryId: worshipSongs.id,
      tags: ["lullaby", "psalms", "baby", "sleep"],
    },
  ];

  const createdContent = [];
  for (const item of contentItems) {
    const { ageBands, categoryId, tags, ...contentData } = item;

    // Upsert tags
    const tagRecords = await Promise.all(
      tags.map((name) =>
        prisma.tag.upsert({
          where: { name },
          create: { name },
          update: {},
        })
      )
    );

    const content = await prisma.content.create({
      data: {
        ...contentData,
        ageBands: {
          create: ageBands.map((ab) => ({ ageBand: ab })),
        },
        categories: {
          create: [{ categoryId }],
        },
        tags: {
          create: tagRecords.map((t) => ({ tagId: t.id })),
        },
      },
    });

    createdContent.push(content);
  }

  console.log(`  Created ${createdContent.length} content items`);

  // ── Playlists ───────────────────────────────────────────────────────
  const playlists = [
    {
      title: "Bedtime Stories",
      description: "Calm and gentle stories perfect for winding down before sleep.",
      isSystem: true,
      contentIndices: [4, 9], // Bedtime Prayer, Baby Lullaby
    },
    {
      title: "Sunday Morning Songs",
      description: "Uplifting worship songs to start the Lord's day.",
      isSystem: true,
      contentIndices: [2, 3], // Jesus Loves Me, This Little Light
    },
    {
      title: "Heroes of the Bible",
      description: "Stories of brave men and women who trusted God.",
      isSystem: true,
      contentIndices: [0, 1, 7], // David & Goliath, Noah's Ark, Joseph
    },
  ];

  for (const pl of playlists) {
    const { contentIndices, ...playlistData } = pl;
    await prisma.playlist.create({
      data: {
        ...playlistData,
        items: {
          create: contentIndices.map((idx, order) => ({
            contentId: createdContent[idx].id,
            sortOrder: order + 1,
          })),
        },
      },
    });
  }

  console.log(`  Created ${playlists.length} playlists`);

  // ── Memory Verses ───────────────────────────────────────────────────
  const verses = [
    { reference: "John 3:16", text: "For God so loved the world that he gave his one and only Son.", ageBand: "EARLY_READER" as const, dayOfYear: 1 },
    { reference: "Psalm 23:1", text: "The Lord is my shepherd, I shall not want.", ageBand: "EARLY_READER" as const, dayOfYear: 2 },
    { reference: "Proverbs 3:5", text: "Trust in the Lord with all your heart.", ageBand: "EARLY_READER" as const, dayOfYear: 3 },
    { reference: "Philippians 4:13", text: "I can do all things through Christ who strengthens me.", ageBand: "EARLY_READER" as const, dayOfYear: 4 },
    { reference: "Genesis 1:1", text: "In the beginning God created the heavens and the earth.", ageBand: "PRESCHOOL" as const, dayOfYear: 1 },
    { reference: "Psalm 136:1", text: "Give thanks to the Lord, for he is good.", ageBand: "PRESCHOOL" as const, dayOfYear: 2 },
    { reference: "Matthew 19:14", text: "Jesus said, Let the little children come to me.", ageBand: "PRESCHOOL" as const, dayOfYear: 3 },
    { reference: "Psalm 139:14", text: "I am fearfully and wonderfully made.", ageBand: "TODDLER" as const, dayOfYear: 1 },
    { reference: "Psalm 118:24", text: "This is the day the Lord has made.", ageBand: "TODDLER" as const, dayOfYear: 2 },
    { reference: "1 John 4:8", text: "God is love.", ageBand: "BABY" as const, dayOfYear: 1 },
  ];

  for (const verse of verses) {
    await prisma.memoryVerse.upsert({
      where: {
        ageBand_dayOfYear: {
          ageBand: verse.ageBand,
          dayOfYear: verse.dayOfYear,
        },
      },
      create: verse,
      update: {},
    });
  }

  console.log(`  Created ${verses.length} memory verses`);

  // ── Badges ──────────────────────────────────────────────────────────
  const badgeData = [
    {
      name: "First Story",
      description: "Watched your very first story!",
      criteria: "Watch 1 story",
      rules: [{ metric: "stories_watched", threshold: 1 }],
    },
    {
      name: "Series Starter",
      description: "Completed your first series!",
      criteria: "Complete 1 series",
      rules: [{ metric: "series_completed", threshold: 1 }],
    },
    {
      name: "Song Lover",
      description: "Listened to 10 worship songs!",
      criteria: "Listen to 10 songs",
      rules: [{ metric: "songs_listened", threshold: 10 }],
    },
    {
      name: "Prayer Warrior",
      description: "Completed 7 days of prayer!",
      criteria: "Pray for 7 days",
      rules: [{ metric: "prayers_completed", threshold: 7 }],
    },
    {
      name: "Bible Explorer",
      description: "Completed 5 memory verses!",
      criteria: "Complete 5 memory verses",
      rules: [{ metric: "verses_completed", threshold: 5 }],
    },
  ];

  for (const badge of badgeData) {
    const { rules, ...badgeInfo } = badge;
    const existing = await prisma.badge.findUnique({ where: { name: badgeInfo.name } });
    if (!existing) {
      await prisma.badge.create({
        data: {
          ...badgeInfo,
          rules: {
            create: rules,
          },
        },
      });
    }
  }

  console.log(`  Created ${badgeData.length} badges`);

  // ── Test Admin Account ──────────────────────────────────────────────
  const adminExists = await prisma.adminUser.findUnique({
    where: { email: "admin@lighthouse.kids" },
  });

  if (!adminExists) {
    await prisma.adminUser.create({
      data: {
        email: "admin@lighthouse.kids",
        displayName: "LightHouse Admin",
        role: "SUPER_ADMIN",
      },
    });
    console.log("  Created test admin account (admin@lighthouse.kids)");
  }

  // Also create a matching Account record for JWT login
  const accountExists = await prisma.account.findUnique({
    where: { email: "admin@lighthouse.kids" },
  });

  if (!accountExists) {
    await prisma.account.create({
      data: {
        email: "admin@lighthouse.kids",
        displayName: "LightHouse Admin",
        emailVerified: true,
      },
    });
    console.log("  Created test parent account (admin@lighthouse.kids)");
  }

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
