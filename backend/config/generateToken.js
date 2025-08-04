// 
// const jwt = require("jsonwebtoken");

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });
// };

// module.exports = generateToken;


const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library

/**
 * @description Generates a JSON Web Token (JWT) for a given user ID.
 * @param {string} id - The user ID to be included in the token's payload.
 * @returns {string} The signed JWT string.
 *
 * This function relies on the JWT_SECRET environment variable for signing.
 * It is CRITICAL that process.env.JWT_SECRET is a strong, random, and confidential string.
 * It must be consistent across all environments (local, production) for a given deployment,
 * but should be unique for different applications.
 */
const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload: The data to be encoded in the token (here, the user ID)
    process.env.JWT_SECRET, // Secret key used to sign the token (from environment variables)
    {
      expiresIn: "30d", // Token expiration time (e.g., '1h', '7d', '30d').
                       // This helps mitigate the risk of compromised tokens being used indefinitely.
    }
  );
};

module.exports = generateToken;