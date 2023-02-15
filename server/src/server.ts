/* PROJECT IMPORT */
import app from "./app";
import env from "./util/validateEnv";

/* EXTERNAL PACKAGES */
import mongoose from "mongoose";

const port = env.PORT;

mongoose
  .connect(env.MONGO_URL)
  .then(() => {
    console.log("DB Connected");
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch(console.error);
