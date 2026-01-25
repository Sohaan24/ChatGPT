require('dotenv').config();
const fetch = require('node-fetch');

const getAPIResponse = async(messagesHistory)=>{
    const options = {
     method : "POST",
     headers : {
      "Content-Type" : "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
     },
     body : JSON.stringify({
      model : "llama-3.3-70b-versatile",
      messages : messagesHistory 
  })
  }

  try{
   const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
   const data = await response.json();
   const aiResponse = data.choices[0].message.content ;
   return aiResponse
  }catch(err){
    console.log(err) ;
    throw new Error("failed to get API response")
  }
}

module.exports = getAPIResponse ;

