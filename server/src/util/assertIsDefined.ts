/* T ALLOWS ANY TYPE TO BE PASSED TO THIS FUNCTION */
/* T MAKES SURE THAT IT IS NON-NULLABLE, COMPARED TO ANY THAT CAN BE NULL */

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (!val) {
    throw Error("Expected 'val' to be defined, but received " + val);
  }
}
