class HttpError extends Error {
  constructor(message?: string) {
    /* NOTIFY THE SUPERCLASS ABOUT THIS MESSAGE */
    super(message);
    /* THIS ALLOWS THE CLASSNAME TO BE USED */
    /* E.G THE UNAUTHORIZEDERROR NAME WILL BE PUT IN THE ERROR CLASS AS THE NAME */
    this.name = this.constructor.name;
  }
}

/** * STATUS CODE: 401 */
export class UnauthorizedError extends HttpError {}

/** * STATUS CODE: 409 */
export class ConflictError extends HttpError {}


