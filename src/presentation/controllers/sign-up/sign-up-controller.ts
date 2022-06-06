import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
} from "../../protocols";

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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

      if (!this.emailValidator.validate(httpRequest.body["email"])) {
        return badRequest(new InvalidParamError("email"));
      }

      return new Promise((res) => res(null));
    } catch (error) {
      return serverError(error);
    }
  }
}
