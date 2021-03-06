const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDB();

// Routes Files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");

const app = express();

// Dev Logging Middleware

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Use Body Parser
app.use(express.json());
// User cookiePrser
app.use(cookieParser());

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
// Error Handler Middleware

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);

// Handle unhandled Promise Rejections

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`.red);

  // Close the Server and exit process
  server.close(() => process.exit(1));
});
