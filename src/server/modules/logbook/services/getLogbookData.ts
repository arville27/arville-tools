import { procedure } from '@/server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { z } from 'zod';
import { ENRICHMENT_ENDPOINT } from '../config';
import { errorSchema } from '../schema/errorSchema';
import { axiosInstance } from '../utils/axiosInstance';
import { getHttpStatusName } from '../utils/getHttpStatusName';
import { changeSemester } from './changeSemester';

export const GetLogbookDataParameterSchema = z.object({ jwt: z.string() });
export type GetLogbookDataParameter = z.infer<typeof GetLogbookDataParameterSchema>;

export const logbookPerMonth = z.object({
  month: z.number(),
  year: z.number(),
  log_book_month_details: z.array(
    z.object({
      uid: z.string(),
      clock_in: z.string(),
      clock_out: z.string(),
      activity: z.string(),
      description: z.string(),
      date_filled: z.string(),
    })
  ),
});

const logbookSuccessSchema = z.object({
  status: z.number(),
  data: z.object({
    logbookMonth: z.array(logbookPerMonth),
  }),
});

export async function getLogbookData({ jwt }: GetLogbookDataParameter) {
  try {
    const response = await axiosInstance.get(ENRICHMENT_ENDPOINT.LOGBOOK_DATA, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const successfulResponse = logbookSuccessSchema.safeParse(response.data);

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
      data: successfulResponse.data.data.logbookMonth,
    };
  } catch (e: unknown) {
    if (e instanceof TRPCError) throw e;
    if (axios.isAxiosError(e) && e.response) {
      const errorResponse = errorSchema.safeParse(e.response.data);

      if (errorResponse.success) {
        throw new TRPCError({
          message: JSON.stringify(errorResponse.data.message),
          code: getHttpStatusName(e.response.status),
        });
      } else {
        console.log(e.response);
        throw new TRPCError({
          message: "Check BINUS official site, if it's up then the dev fucked up",
          code: getHttpStatusName(e.response.status),
        });
      }
    }

    throw new TRPCError({
      message: 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export const getLogbookDataProcedure = procedure
  .input(GetLogbookDataParameterSchema)
  .query(async ({ input }) => {
    const changeSemesterResp = await changeSemester({ semester: 6, jwt: input.jwt });
    if (changeSemesterResp.binusStatusCode !== 200) {
      throw new TRPCError({
        message: 'Internal Server Error',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }

    return getLogbookData(input);
  });
