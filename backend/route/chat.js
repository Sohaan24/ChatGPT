const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController") ;
const fetchUser = require("../middleware/fetchUser") ;

router.post("/guest", chatController.guestChat) ;
router.post("/chat",fetchUser, chatController.chat);

// all thread

router.get("/allthreads",fetchUser, chatController.allThreads);

router.get("/thread/:id",fetchUser, chatController.getThread);

//update route
router.patch("/thread/:id",fetchUser, chatController.updateThread);

//delete route
router.delete("/delete/:id",fetchUser, chatController.deleteThread);

module.exports = router;
