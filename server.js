const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

// Load env vars 
dotenv.config({path: './config/config.env'})

// Connect to DB
connectDB();

// Routes Files 
const bootcamps = require('./routes/bootcamps')

const app = express();

// Dev Logging Middleware

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Use Body Parser 
app.use(express.json())

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)



// Error Handler Middleware

app.use(errorHandler)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))


// Handle unhandled Promise Rejections

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error ${err.message}`.red)

    // Close the Server and exit process
    server.close(()=> process.exit(1))
})