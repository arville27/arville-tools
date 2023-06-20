import { TRPCError } from '@trpc/server';

export function getHttpStatusName(code: number | undefined): TRPCError['code'] {
  if (typeof code !== 'number') return 'INTERNAL_SERVER_ERROR';
  switch (code) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 405:
      return 'METHOD_NOT_SUPPORTED';
    case 408:
      return 'TIMEOUT';
    case 409:
      return 'CONFLICT';
    case 412:
      return 'PRECONDITION_FAILED';
    case 413:
      return 'PAYLOAD_TOO_LARGE';
    case 422:
      return 'UNPROCESSABLE_CONTENT';
    case 429:
      return 'TOO_MANY_REQUESTS';
    case 499:
      return 'CLIENT_CLOSED_REQUEST';
    default:
      return 'INTERNAL_SERVER_ERROR';
  }
}
