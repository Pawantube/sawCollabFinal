const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//@description Get or Search all users (excluding the current user)
//@route GET /api/user?search=
//@access Protected (requires authentication middleware like `protect` to set `req.user`)
const allUsers = asyncHandler(async (req, res) => {
// Ensure the user is authenticated; req.user should be available from middleware
if (!req.user || !req.user._id) {
res.status(401); // Unauthorized
throw new Error("Authentication required to search users.");
}

const keyword = req.query.search
? {
	$or: [
		{ name: { $regex: req.query.search, $options: "i" } }, // Case-insensitive name search
		{ email: { $regex: req.query.search, $options: "i" } }, // Case-insensitive email search
	],
	}
: {}; // If no search keyword, it means fetch all users (excluding self)

try {
// Find users based on the keyword, excluding the currently logged-in user
// Using .lean() for performance as we don't need Mongoose document methods on the results
const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).lean();

if (!users) {
	// This case is unlikely unless there's a database connectivity issue
	// or a very specific query that returns null, but good for explicit handling.
	console.warn("allUsers: No users found matching the criteria.");
	return res.status(200).json([]); // Return empty array if no users found
}

res.status(200).json(users);
} catch (error) {
console.error("allUsers: Error fetching users:", error.message);
res.status(500); // Internal Server Error for database issues
throw new Error("Failed to retrieve users. Please try again later.");
}
});

//@description Register a new user
//@route POST /api/user/
//@access Public
const registerUser = asyncHandler(async (req, res) => {
const { name, email, password, pic } = req.body; // pic is optional

// Input validation: Check for required fields
if (!name || !email || !password) {
res.status(400);
throw new Error("Please enter all required fields: Name, Email, and Password.");
}

try {
// Check if a user with the given email already exists
const userExists = await User.findOne({ email });

if (userExists) {
	res.status(409); // Conflict status code for existing resource
	throw new Error("User with this email already exists.");
}

// Create a new user in the database
const user = await User.create({
	name,
	email,
	password, // Password hashing should be handled in the pre-save hook of userModel
	pic, // Optional field
});

if (user) {
	// Respond with user details and a generated JWT token
	res.status(201).json({ // 201 Created status for successful resource creation
	_id: user._id,
	name: user.name,
	email: user.email,
	isAdmin: user.isAdmin,
	pic: user.pic,
	token: generateToken(user._id), // Generate and send JWT token
	});
} else {
	// This 'else' block implies User.create somehow failed without throwing an error
	console.error("registerUser: User creation failed unexpectedly without throwing an error.");
	res.status(500); // Internal Server Error
	throw new Error("User registration failed. Please try again.");
}
} catch (error) {
// Catch any errors during the registration process (e.g., database issues, validation errors)
console.error("registerUser: Error during user registration:", error.message);
// If the status was already set by a specific error (e.g., 409), keep it.
// Otherwise, default to 500 for general server errors.
if (!res.headersSent) { // Check if headers were already sent to avoid "Cannot set headers after they are sent to the client"
	res.status(res.statusCode === 200 ? 500 : res.statusCode);
}
throw new Error(error.message || "An unexpected error occurred during registration.");
}
});

//@description Authenticate a user and generate token
//@route POST /api/user/login (Note: original comment was /api/users/login)
//@access Public
const authUser = asyncHandler(async (req, res) => {
const { email, password } = req.body;

// Input validation: Check for required fields
if (!email || !password) {
res.status(400);
throw new Error("Please enter both email and password.");
}

try {
// Find the user by email
const user = await User.findOne({ email });

// If user exists and password matches (handled by userModel.matchPassword method)
if (user && (await user.matchPassword(password))) {
	res.status(200).json({ // 200 OK status for successful authentication
	_id: user._id,
	name: user.name,
	email: user.email,
	isAdmin: user.isAdmin,
	pic: user.pic,
	token: generateToken(user._id), // Generate and send JWT token
	});
} else {
	// User not found or password does not match
	res.status(401); // Unauthorized status
	throw new Error("Invalid Email or Password.");
}
} catch (error) {
// Catch any errors during the authentication process (e.g., database issues)
console.error("authUser: Error during user authentication:", error.message);
if (!res.headersSent) {
	res.status(res.statusCode === 200 ? 500 : res.statusCode);
}
throw new Error(error.message || "An unexpected error occurred during login.");
}
});

module.exports = { allUsers, registerUser, authUser };