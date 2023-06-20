import { procedure } from '@/server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { z } from 'zod';
import { ENRICHMENT_ENDPOINT } from '../config';
import { errorSchema } from '../schema/errorSchema';
import { axiosInstance } from '../utils/axiosInstance';
import { getHttpStatusName } from '../utils/getHttpStatusName';

export const ChangeSemesterParameterSchema = z.object({
  semester: z.number().gte(5).lte(6),
  jwt: z.string(),
});

export type ChangeSemesterParameter = z.infer<typeof ChangeSemesterParameterSchema>;

const changeSemesterSuccessSchema = z.object({
  status: z.number(),
});

export async function changeSemester({ semester, jwt }: ChangeSemesterParameter) {
  try {
    const response = await axiosInstance.get(
      ENRICHMENT_ENDPOINT.CHANGE_SEMESTER(semester),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
      }
    );

    const successfulResponse = changeSemesterSuccessSchema.safeParse(response.data);

    // This check is needed because of binus API beatiful design
    if (!successfulResponse.success) {
      throw new TRPCError({
        message: JSON.stringify(response.data.message),
        code: getHttpStatusName(response.data.status ?? response.status),
      });
    }

    return {
      binusStatusCode: successfulResponse.data.status,
    };
  } catch (e: unknown) {
    if (e instanceof TRPCError) throw e;
    if (axios.isAxiosError(e) && e.response) {
      const errorResponse = errorSchema.parse(e.response.data);

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

export const changeSemesterProcedure = procedure
  .input(ChangeSemesterParameterSchema)
  .mutation(({ input }) => changeSemester(input));
