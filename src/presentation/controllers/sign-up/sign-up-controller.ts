import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class SignUpController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = [
      "name",
      "age",
      "birth",
      "address",
      "email",
      "password",
    ];

    const missingFields = [];

    for (let requiredField of requiredFields) {
      if (!httpRequest.body[requiredField]) {
        missingFields.push(requiredField);
      }
    }

    if (missingFields.length > 0) {
      return badRequest(new MissingParamError(missingFields));
    }

    return new Promise((res) => res(null));
  }
}
