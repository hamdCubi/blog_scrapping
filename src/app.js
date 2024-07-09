const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require("morgan");
const mongoose = require("mongoose")



app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
})
const authRoutes = require('./routes/AuthRoutes');



app.use('/api/auth', authRoutes);



//Error handler
app.all('*', (req, res, next) => {
    return res.status(500).json({ message: `Can't find ${req.originalUrl} on this server!` });
});

const options = {
    maxPoolSize: 10, // Limit the number of connections in the pool
    useNewUrlParser: true, // Parse connection string with useNewUrlParser
    useUnifiedTopology: true, // Use new Server Discover and Monitoring engine
  };
  
  const dbName = "blog";
  const uri = "mongodb://localhost:27017/" + dbName + "?retryWrites=true&w=majority";
  
  mongoose.connect(uri, options);
  
  mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected to " + dbName);
  });
  
  mongoose.connection.on('disconnected', function () {
    console.log("Mongoose is disconnected");
    process.exit(1); // Exit process on disconnect
  });
  
  mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ', err);
    process.exit(1); // Exit process on errora
  });
  
  process.on('SIGINT', async function () {
    await mongoose.connection.close();
    console.log("Mongoose connection is disconnected due to app termination");
    process.exit(0);
  });
  
  

module.exports = app;
