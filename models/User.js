import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true,unique: true},
  phone: { type: String },
  password: { type: String, required: true }, // plain text password

   isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type:String,
      
    },
},
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
