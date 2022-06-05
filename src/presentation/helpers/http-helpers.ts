import { HttpResponse, StatusCode } from "../protocols";

export const badRequest = (error: Error): HttpResponse => ({
  body: error,
  statusCode: StatusCode.BAD_REQUEST,
});
