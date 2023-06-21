import { procedure } from '@/server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { z } from 'zod';
import { ENRICHMENT_ENDPOINT } from '../config';
import { errorSchema } from '../schema/errorSchema';
import { axiosInstance } from '../utils/axiosInstance';
import { getHttpStatusName } from '../utils/getHttpStatusName';

export const UpdateLogbookParameterSchema = z.object({
  jwt: z.string(),
  logbookData: z.object({
    activity: z.string().min(1),
    description: z.string().min(1),
    uid: z.string(),
    clock_in: z.string().min(3),
    clock_out: z.string().min(3),
    dateFilled: z.string(),
  }),
});

const successfulUpdateResponseSchema = z.object({ status: z.number() });

export type UpdateLogbookParameter = z.infer<typeof UpdateLogbookParameterSchema>;

export async function updateLogbook({ jwt, logbookData }: UpdateLogbookParameter) {
  try {
    const response = await axiosInstance.post(
      ENRICHMENT_ENDPOINT.UPDATE_LOGBOOK(logbookData.uid),
      logbookData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
      }
    );

    const successfulResponse = successfulUpdateResponseSchema.safeParse(response.data);

    // This check is needed because of binus API beatiful API design
    if (
      !successfulResponse.success ||
      successfulResponse.data.status < 200 ||
      successfulResponse.data.status > 300
    ) {
      throw new TRPCError({
        message: JSON.stringify(response.data.message),
        code: getHttpStatusName(response.data.status ?? response.status),
      });
    }

    return {
      data: String(successfulResponse.data.status),
    };
  } catch (e: unknown) {
    if (e instanceof TRPCError) throw e;
    if (axios.isAxiosError(e) && e.response) {
      const errorResponse = errorSchema.parse(e.response);

      throw new TRPCError({
        message: JSON.stringify(errorResponse.message),
        code: getHttpStatusName(e.response.status),
      });
    }

    throw new TRPCError({
      message: 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export const updateLogbookProcedure = procedure
  .input(UpdateLogbookParameterSchema)
  .mutation(async ({ input }) => updateLogbook(input));
