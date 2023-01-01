import { z } from "zod";
import { Agent } from "https";
import { router, procedure } from "../trpc";
import fetch from "node-fetch";

const requestOption = {
  agent: new Agent({
    rejectUnauthorized: false,
  }),
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.47",
  },
};

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

export const logbookUpdateBodySchema = z.object({
  activity: z.string().min(1),
  description: z.string().min(1),
  uid: z.string(),
  clockIn: z.string().length(5),
  clockOut: z.string().length(5),
  dateFilled: z.string(),
});

const logbookSuccessSchema = z.object({
  data: z.object({
    logbookMonth: z.array(logbookPerMonth),
  }),
});

const authSuccessSchema = z.object({
  data: z.object({
    token: z.string(),
  }),
});

const errorSchema = z.object({
  message: z.any(),
});

export const logbookRouter = router({
  auth: procedure
    .input(z.object({ nim: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      const authEndpoint =
        "https://enrichment-socs.apps.binus.ac.id/lp-api/api/auth/login";

      const resp = await fetch(authEndpoint, {
        ...requestOption,
        headers: {
          ...requestOption.headers,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: input.nim,
          password: input.password,
        }),
      });

      const result = (await resp.json()) as any;

      if (authSuccessSchema.safeParse(result).success)
        return {
          success: true,
          data: result.data.token as string,
        };
      else if (errorSchema.safeParse(result).success)
        return {
          success: false,
          data: result.message as string,
        };
      else
        return {
          success: false,
          data: "Internal server error",
        };
    }),
  updateLogbook: procedure
    .input(
      z.object({
        jwt: z.string(),
        logbookData: logbookUpdateBodySchema,
      })
    )
    .mutation(async ({ input }) => {
      const updateEndpoint = `https://enrichment-socs.apps.binus.ac.id/lp-api/api/student/log-book/${input.logbookData.uid}/edit`;

      const resp = await fetch(updateEndpoint, {
        ...requestOption,
        headers: {
          ...requestOption.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${input.jwt}`,
        },
        method: "POST",
        body: JSON.stringify({
          uid: input.logbookData.uid,
          clock_in: input.logbookData.clockIn,
          clock_out: input.logbookData.clockOut,
          activity: input.logbookData.activity,
          description: input.logbookData.description,
        }),
      });

      const result = (await resp.json()) as any;

      if (z.object({ status: z.number() }).safeParse(result).success)
        return {
          success: true,
          data: String(result.status),
        };
      else if (errorSchema.safeParse(result).success)
        return {
          success: false,
          data: result.message as string,
        };
      else
        return {
          success: false,
          data: "Internal server error",
        };
    }),
  getLogbookData: procedure
    .input(z.object({ jwt: z.string() }))
    .query(async ({ input }) => {
      const logbookEndpoint =
        "https://enrichment-socs.apps.binus.ac.id/lp-api/api/student/log-book";

      const resp = await fetch(logbookEndpoint, {
        ...requestOption,
        headers: {
          ...requestOption.headers,
          Authorization: `Bearer ${input.jwt}`,
        },
      });

      const result = (await resp.json()) as any;

      const parseResult = logbookSuccessSchema.safeParse(result);
      if (!parseResult.success)
        return { success: false, data: result.message as string };
      else
        return {
          success: true,
          data: parseResult.data.data.logbookMonth as z.infer<
            typeof logbookPerMonth
          >[],
        };
    }),
});
