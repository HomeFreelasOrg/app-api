import { StatusCode } from ".";

export interface HttpResponse {
  body: any;
  statusCode: StatusCode;
}
