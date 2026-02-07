require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors") ;
const mongoose = require("mongoose");

const app = express() ;
const dburl = process.env.MONGO_URL
const PORT = 3000 ;

const chatRouter = require("./route/chat");
const authRouter = require("./route/authRoutes") ;
const errorHandler = require("./middleware/errorHandler") ;

app.use(express.json()) ;
app.use(cors()) ;

app.use("/api/auth",authRouter) ;
app.use("/api", chatRouter);

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); 
});

app.use(errorHandler) ;

async function main() {
  try {
    await mongoose.connect(dburl); 
    console.log("Connected to MongoDB Atlas successfully");

    
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
    

  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); 
  }
}

if (require.main === module) {
    main();
}

module.exports = app;

