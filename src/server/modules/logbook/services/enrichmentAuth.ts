import { procedure } from '@/server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { z } from 'zod';
import { ENRICHMENT_ENDPOINT } from '../config';
import { errorSchema } from '../schema/errorSchema';
import { axiosInstance } from '../utils/axiosInstance';
import { getHttpStatusName } from '../utils/getHttpStatusName';

export const EnrichmentAuthParameterSchema = z.object({
  nim: z.string(),
  password: z.string(),
});

export type EnrichmentAuthParameter = z.infer<typeof EnrichmentAuthParameterSchema>;

const authSuccessSchema = z.object({
  status: z.number(),
  data: z.object({
    token: z.string(),
  }),
});

export async function enrichmentAuth({ nim, password }: EnrichmentAuthParameter) {
  try {
    const response = await axiosInstance.post(
      ENRICHMENT_ENDPOINT.AUTH,
      {
        username: nim,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const successfulResponse = authSuccessSchema.safeParse(response.data);

    // This check is needed because of binus API beatiful design
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
      accessToken: successfulResponse.data.data.token,
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

export const enrichmentAuthProcedure = procedure
  .input(EnrichmentAuthParameterSchema)
  .mutation(({ input }) => enrichmentAuth(input));
