import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

/* ENSURES THE VALIDATION OF ENV VARIABLES */
/* PORT HAS A SPECIAL TYPE, STR WOULD STILL WORK AS WELL */
export default cleanEnv(process.env, {
  MONGO_URL: str(),
  PORT: port(),
  SESSION_SECRET: str(),
});
