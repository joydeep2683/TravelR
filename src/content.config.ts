import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const trips = defineCollection({
  // In Astro 5, for file-based collections in src/content we can use the glob loader 
  // or just rely on the default behavior if 'loader' is omitted for standard collections?
  // Actually, standard 'type: content' is still valid in Astro 5 for valid legacy behavior or standard behavior.
  // But let's use the new loader text if possible. 
  // Wait, let's stick to the standard 'type: content' API for now as it's most robust documentation-wise.
  // Actually, for Astro 5, `loader: glob({ pattern: "**\/[^_]*.md", base: "./src/content/trips" })` is the way if using loaders.
  // usage of `type: 'content'` is deprecated? No, it's just the old way. 
  // Let's use `loader: glob(...)` to be modern if we are on v5.
  // However, `create-astro` might have set up `src/content` in the old way.
  // Let's check if `src/content` exists. Yes.
  // I will use `loader` because it is more flexible.
  loader: glob({ pattern: "**/*.md", base: "./src/content/trips" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    coverImage: z.string(),
    gallery: z.array(z.string()).optional(),
  }),
});

export const collections = {
  trips,
};
