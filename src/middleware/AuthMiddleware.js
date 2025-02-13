const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types; // Use ObjectId from mongoose.Types
const User = require('../models/UserModel'); // Assuming you have a User model defined

const SECRET = "THE_SECRET_KEY"; // Replace with your actual secret key

const AuthMiddleware = (optional = true) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.Token; // Assuming you store the token in a cookie named 'Token'
      
      if (!token) {
        return res.status(401).send("Login required");
      }
      
      jwt.verify(token, SECRET, async function (err, decodedData) {
        if (err) {
          return res.status(401).send("Authentication failed");
        }
        
        // Check if token is expired
        const nowDate = Math.floor(Date.now() / 1000);
        if (decodedData.exp < nowDate) {
          return res.status(401).send("Token expired, please log in again");
        }

        // Fetch user from MongoDB using Mongoose
        const user = await User.findById(decodedData.userId);
        if (!user) {
          return res.status(404).send("User not found");
        }

        // Attach user object to the request for further middleware or route handlers
        req.user = user;
        req.decodedData = decodedData;
        next();
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
}

module.exports = AuthMiddleware;
