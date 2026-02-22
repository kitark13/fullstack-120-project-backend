import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 64,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      required: true,
      default: "https://ac.goit.global/fullstack/react/default-avatar.jpg",
    },
    description: {
      type: String,
      // required: true,
      default: "",
      trim: true,
      maxlength: 150,
    },
    articlesAmount: { type: Number, default: 0 },
    savedStories: [{ type: Schema.Types.ObjectId, ref: "Story", default: [] }],
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model("User", userSchema);
