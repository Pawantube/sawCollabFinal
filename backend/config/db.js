// const mongoose = require("mongoose");
// const colors = require("colors");

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI , {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
//   } catch (error) {
//     console.error(`Error: ${error.message}`.red.bold);
//     process.exit(1); // Exit with a non-zero status code to indicate an error
//   }
// };

// module.exports = connectDB;


const mongoose = require("mongoose");
const colors = require("colors"); // For colored console output in development

// @description Connects to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables.
    // process.env.MONGO_URI MUST be set correctly in your .env file (local)
    // and in your hosting environment (e.g., Render) for production.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful, log the host for confirmation.
    // Using 'colors' for better readability in the console (primarily for dev).
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    // If connection fails, log the error message.
    console.error(`❌ Error: ${error.message}`.red.bold);
    
    // In a production environment, if the database is unreachable,
    // the application cannot function correctly. Exiting the process
    // ensures that the application doesn't run in a broken state
    // and allows deployment tools (like Render) to restart it,
    // potentially resolving transient network issues or prompting intervention.
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};

module.exports = connectDB;