import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  birthday: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    enum : ['student', 'instructor', 'admin'],
    default: 'student',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: true,
  },
  subscribed: {
    newslettter: {
      type: Boolean,
      default: true,
    },
    notifications: {
      type: Boolean,
      default: true,
    }
  },
  services : [{type: mongoose.Schema.Types.ObjectId, ref: 'Service'}],
  payments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Payment'}],
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;
