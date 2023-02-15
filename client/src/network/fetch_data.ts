import { ConflictError, UnauthorizedError } from "../errors/http_errors";

export async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  /* ============================= NOTE ============================= */
  /* TRUE IF RESPONSE.OK IS BETWEEN 200-300, FALSE BETWEEN 400-500 */
  /* ERROR IS SENT BACK INSIDE A JSON BODY IN APP.TS SERVER */
  /* REMINDER TO ADD NEW KEYWORD WHEN REFERENCING A CLASS TO INSTANTIATE IT */
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    if (response.status === 401) {
      throw new UnauthorizedError(errorMessage);
    } else if (response.status === 409) {
      throw new ConflictError(errorMessage);
    } else {
      throw Error(`Request failed with status: ${response.status} message: ${errorMessage}`);
    }
  }
}
