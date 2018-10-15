const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  avatar: {
    type: String,
    default: 'https://storage.googleapis.com/all-storage-e-commerce/person-icon-user-person-man-icon-4.png'
  },
  fname: {
    type: String,
    required: [true, "Firstname required"]
  },
  lname: String,
  email: {
    type: String,
    unique: true,
    required: [true, "Email required"]
  },
  password: {
    type: String,
    required: [true, "password required"]
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: "Shop"
  },
  transaction: [{
    type: Schema.Types.ObjectId,
    ref: "Transaction"
  }],
  verified: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    default: "user"
  },
  loginWeb: {
    type: Number,
    default: 1
  },
  loginGoogle: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.post("validate", doc => {
  let hash = bcrypt.hashSync(doc.password, Number(process.env.HASH_PW));
  doc.password = hash;
});

const User = mongoose.model("User", userSchema);

module.exports = User;