import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

type User = InferSchemaType<typeof userSchema>;
export default model<User>("User", userSchema);

/* ================================== NOTE ================================== */
/* SELECT FALSE MEANS THAT BOTH EMAIL AND PASS ARE NOT SENT TO THE FRONT END */
/* STRING PASSED TO MODEL WILL CREATE A COLLECTION IN THE DB NAMED USER */
