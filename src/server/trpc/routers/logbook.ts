import { enrichmentAuthProcedure } from '@/server/modules/logbook/services/enrichmentAuth';
import { getLogbookDataProcedure } from '@/server/modules/logbook/services/getLogbookData';
import { updateLogbookProcedure } from '@/server/modules/logbook/services/updateLogbook';
import { router } from '../trpc';

export const logbookRouter = router({
  auth: enrichmentAuthProcedure,
  updateLogbook: updateLogbookProcedure,
  getLogbookData: getLogbookDataProcedure,
});
