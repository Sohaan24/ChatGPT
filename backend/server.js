require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors") ;
const Groq = require('groq-sdk');
const app = express() ;
const dburl = process.env.MONGO_URL
const PORT = 3000 ;
const mongoose = require("mongoose");
const Schema = mongoose.Schema ;
const getAPIResponse = require("./utils/groqAPI");
const chatRouter = require("./route/chat");

app.use(express.json()) ;
app.use(cors()) ;

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

app.use("/api", chatRouter);

main();

