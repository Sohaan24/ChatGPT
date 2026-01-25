const express = require("express");
const Thread = require("../model/Thread");
const router = express.Router();
const getAPIResponse = require("../utils/groqAPI");

router.post("/chat", async (req, res) => {
  try {
    const {message} = req.body ;
    let initialMessages = [] ;
    if(message){
      initialMessages.push({role : "user", content : message});
      const assistantReply = await getAPIResponse(initialMessages) ;
      initialMessages.push({role : "assistant", content : assistantReply});
    }
    const newThread = new Thread({
      title: message ? message.substring(0,30) : "New Chat",
      messages: initialMessages,
    });

    const savedThread = await newThread.save();
    res.status(201).json(savedThread) ;
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to Create a new Chat" });
  }
});

// all threads

router.get("/allthreads", async (req, res) => {
  try {
    const allThreads = await Thread.find().sort({ updatedAt: -1 });
    if (!allThreads) {
      return res.status(404).send({ error: "failed to get threads" });
    }
    res.json(allThreads);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "server error" });
  }
});

router.get("/thread/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).send({ error: "thread not found" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "server error" });
  }
});

//update route
router.patch("/thread/:id", async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).send({ error: "the message is required" });
  }
  try {
    // First, verify that the thread exists
    const existingThread = await Thread.findById(id);
    if (!existingThread) {
      return res.status(404).send({ error: "thread not found" });
    }

    // Add user message to thread
    const thread = await Thread.findByIdAndUpdate(
      id,
      {
        $push: {
          messages: { role: "user", content: message },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!thread) {
      return res.status(404).send({ error: "thread not found" });
    }

    const formattedMessages = thread.messages.map(msg =>({
        role : msg.role,
        content : msg.content
    }));
    
    // Get response from Groq API
    let assistantReply;
    try {
      assistantReply = await getAPIResponse(formattedMessages);
    } catch (apiError) {
      console.error("Groq API Error:", apiError);
      return res.status(500).send({ error: "Failed to get response from AI service" });
    }

    // Add assistant reply to thread
    const updatedThread = await Thread.findByIdAndUpdate(id,
        {$push : {messages : {role : "assistant", content : assistantReply}}},
        {new : true, runValidators : true}
    );

    res.json({reply : assistantReply}) ;
   
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).send({ error: "server error" });
  }
});

//delete route
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const thread = await Thread.findByIdAndDelete(id);
    if (!thread) {
      return res.status(404).send({ error: "thread not found" });
    }
    res.json({
      message: "thread was deleted",
      deletedThread: thread.title,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "server error" });
  }
});

module.exports = router;
