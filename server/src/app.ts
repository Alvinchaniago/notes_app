import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

/* PROJECT IMPORT */
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import env from "./util/validateEnv";
import { requiresAuth } from "./middleware/auth";

const app = express();

/* LOGGING ALL ENDPOINT ACCESS WITH MORGAN */
app.use(morgan("dev"));

/* DECLARE JSON TYPE */
app.use(express.json());

/* SESSION CONFIG */
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    /* AS LONG AS THE USER IS ON THE WEB, COOKIE IS REFRESHED AUTOMATICALLY THROUGH ROLLING */
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_URL,
    }),
  })
);

/* ROUTES */
app.use("/api/notes", requiresAuth, notesRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint does not exist"));
});

/* ERROR HANDLING */
/* PUT AT THE BOTTOM DUE TO THE NEXT FUNCTION */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "Unknown error occured";
  let statusCode = 500;

  /* CHECK IF THE ERROR IS AN INSTANCE OF HTTP ERROR */
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;

/* ============================== NOTES ============================== */
/* Exec returns a promise */
