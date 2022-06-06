import { ServerError } from "../errors";
import { HttpResponse, StatusCode } from "../protocols";

export const badRequest = (error: Error): HttpResponse => ({
  body: error,
  statusCode: StatusCode.BAD_REQUEST,
});

export const serverError = (error: Error): HttpResponse => ({
  body: new ServerError(error.stack),
  statusCode: StatusCode.SERVER_ERROR,
});

export const ok = (body: any): HttpResponse => ({
  body,
  statusCode: StatusCode.OK,
});
