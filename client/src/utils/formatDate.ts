/* 1ST STRING STATEMENT MEANS THE TYPE OF ARGUMENT PASSED TO THIS FUNCTION  */
/* 2ND STRING STATEMENT MEANS THE RETURN TYPE OF THIS FUNCTION */

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}
