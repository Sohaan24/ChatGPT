const Thread = require("../model/Thread");
const getAPIResponse = require("../utils/groqAPI");
const asyncHandler = require("../utils/asyncHandler");

module.exports.guestChat = asyncHandler(async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400);
    throw new Error("message not found");
  }

  const assistantReply = await getAPIResponse(messages);
  res.json({ reply: assistantReply });
});

module.exports.chat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  let initialMessages = [];
  if (message) {
    initialMessages.push({ role: "user", content: message });
    const assistantReply = await getAPIResponse(initialMessages);
    initialMessages.push({ role: "assistant", content: assistantReply });
  }
  const newThread = new Thread({
    user: req.user.id,
    title: message ? message.substring(0, 30) : "New Chat",
    messages: initialMessages,
  });

  const savedThread = await newThread.save();
  res.status(201).json(savedThread);
});

// all threads

module.exports.allThreads = asyncHandler(async (req, res) => {
  const allThreads = await Thread.find({ user: req.user.id }).sort({
    updatedAt: -1,
  });
  if (!allThreads) {
    return res.status(404).send({ error: "failed to get threads" });
  }
  res.json(allThreads);
});

module.exports.getThread = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const thread = await Thread.findOne({ _id: id, user: req.user.id });
  if (!thread) {
    return res.status(404).send({ error: "thread not found or access denied" });
  }
  res.json(thread.messages);
});

//update route
module.exports.updateThread = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error("Message content is required");
  }

  // First, verify that the thread exists
  const existingThread = await Thread.findOne({ _id: id, user: req.user.id });
  if (!existingThread) {
    res.status(404);
    throw new Error("Thread not found");
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
    },
  );
  if (!thread) {
    res.status(404);
    throw new Error("Thread not found");
  }

  const formattedMessages = thread.messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  // Get response from Groq API
  let assistantReply;
  try {
    assistantReply = await getAPIResponse(formattedMessages);
  } catch (apiError) {
    console.error("Groq API Error:", apiError);
    return res
      .status(500)
      .send({ error: "Failed to get response from AI service" });
  }

  // Add assistant reply to thread
  const updatedThread = await Thread.findByIdAndUpdate(
    id,
    { $push: { messages: { role: "assistant", content: assistantReply } } },
    { new: true, runValidators: true },
  );

  res.json({ reply: assistantReply });
});

//delete route
module.exports.deleteThread = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const thread = await Thread.findOneAndDelete({ _id: id, user: req.user.id });
  if (!thread) {
    res.status(404);
    throw new Error("Thread not found to delete");
  }
  res.json({
    message: "thread was deleted",
    deletedThread: thread.title,
  });
});
