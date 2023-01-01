import { z } from "zod";
import { provider } from "lyrics-scraper";

import { router, procedure } from "../trpc";

export const lyricsRouter = router({
  searchLyrics: procedure
    .input(z.object({ q: z.string() }))
    .query(({ input }) => {
      return provider.getResults(input.q);
    }),
  getLyrics: procedure
    .input(z.object({ url: z.string() }))
    .query(({ input }) => {
      return provider.extractLyrics(input.url);
    }),
});
