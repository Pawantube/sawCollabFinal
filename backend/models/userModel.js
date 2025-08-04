// // const mongoose = require("mongoose");
// // const bcrypt = require("bcryptjs");

// // const userSchema = mongoose.Schema(
// //   {
// //     name: { type: "String", required: true },
// //     email: { type: "String", unique: true, required: true },
// //     password: { type: "String", required: true },
// //     pic: {
// //       type: "String",
// //       required: true,
// //       default:
// //         "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
// //     },
// //     isAdmin: {
// //       type: Boolean,
// //       required: true,
// //       default: false,
// //     },
// //   },
// //   { timestamps: true }
// // );

// // userSchema.methods.matchPassword = async function (enteredPassword) {
// //   return await bcrypt.compare(enteredPassword, this.password);
// // };

// // userSchema.pre("save", async function (next) {
// //   if (!this.isModified) {
// //     next();
// //   }

// //   const salt = await bcrypt.genSalt(10);
// //   this.password = await bcrypt.hash(this.password, salt);
// // });

// // const User = mongoose.model("User", userSchema);

// // module.exports = User;



// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
//     pic: {
//       type: String,
//       required: true,
//       default:
//         "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
//     },
//     isAdmin: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next(); // make sure "password" is passed as string
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // For password hashing

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"], // Custom error message
      trim: true, // Trim whitespace from the start/end
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true, // Ensures email addresses are unique across users
      trim: true,
      lowercase: true, // Store emails in lowercase for consistent lookups
      // Basic email format validation using regex
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Password must be at least 6 characters long"], // Enforce minimum password length
      // Consider adding regex for complexity (e.g., must contain numbers, symbols, etc.)
      // match: [/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, 'Password too weak']
    },
    pic: {
      type: String,
      // Removed 'required: true' here because a default is provided.
      // If 'required: true' is set AND a default exists, the default only applies
      // if the field is completely omitted or explicitly undefined.
      // If client sends an empty string "", it would still pass as empty but valid.
      // Making it not required and relying on the default is a common and flexible pattern.
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true, // While default is false, marking it required ensures it's always set.
      default: false,
      index: true, // If you often query for admins
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// --- Instance Method: Compare Entered Password with Hashed Password ---
// This method is called on a user document (e.g., user.matchPassword(enteredPass))
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Use bcrypt.compare to compare the plaintext password with the hashed password stored in the DB
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- Pre-save Hook: Hash Password Before Saving ---
// This middleware runs BEFORE a document is saved to the database.
// It ensures that passwords are always hashed before being stored.
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  // This prevents re-hashing an already hashed password when updating other fields.
  if (!this.isModified("password")) {
    return next(); // If password not modified, skip hashing and proceed
  }

  // Generate a salt (random string) to hash the password with
  const salt = await bcrypt.genSalt(10); // 10 is a good balance for security and performance

  // Hash the password using the generated salt
  this.password = await bcrypt.hash(this.password, salt);
  
  // Proceed to the next middleware or save operation
  next();
});

// --- Schema-level Indexes for Performance ---
// Indexes significantly speed up query operations on specified fields.
// Only index fields that are frequently queried.

// 1. Index on `email`: Absolutely critical for fast user lookup during login and registration.
userSchema.index({ email: 1 }); // 1 for ascending order

// 2. (Optional) Index on `name`: If you frequently search or sort users by name.
// userSchema.index({ name: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;