import { router } from '../trpc';
import { logbookRouter } from './logbook';
import { lyricsRouter } from './lyrics';

export const appRouter = router({
  lyrics: lyricsRouter,
  logbook: logbookRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
