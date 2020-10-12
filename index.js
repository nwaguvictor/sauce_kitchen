const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
    console.log(`Application encountered a problem.`, err.message)
    console.log(`Shutting down...💥`);
    process.exit(1);
});

// config environment file
dotenv.config({
    path: path.resolve('config.env'),
    encoding: 'utf-8'
})

// Require express application
const app = require('./app');

// Database connection
const DB = process.env.DB_LOCAL_HOST;
mongoose.connect(DB, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true
}).then(() => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Database connected successfully...`)
    }
});

// Create app server
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Start server
server.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Application started on http://localhost:${PORT} ...`);
    }
})

// Handle Exceptions from promises
process.on('unhandledRejection', err => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Application encountered a problem...');
        console.log(err.name, err.message);
    }
    server.close(() => {
        process.exit(1);
    })
})


