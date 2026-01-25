import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { MyContext } from "./MyContext";
import { useContext, useState } from "react";

export default function Search() {
  const {
    prompt,
    setPrompt,
    setIsChatStarted,
    setReply,
    setLoading,
    setPrevChats,
    threadId,
    setThreadId,
    getAllThreads,
    setAllThreads,
    
  } = useContext(MyContext);

  const [isListening, setIsListening] = useState(false);

  const runVoiceRecognition = () => {
    // 1. Check browser support (Chrome/Edge use 'webkit', others use standard)
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Your browser does not support Voice Recognition. Please use Google Chrome or Edge."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.start();
  };

  const getReply = async () => {
    if (!prompt.trim()) return;
    setIsChatStarted(true);
    setLoading(true);

    // Store the current prompt before clearing it
    const currPrompt = prompt;
    setPrompt("");

    if(threadId){
      setAllThreads((prevThreads)=>{
        const currThread = prevThreads.find((t)=> t.threadId === threadId) ;

        const otherThreads = prevThreads.filter((t)=> t.threadId !== threadId) ;

        if(currThread){
          return[currThread, ...otherThreads]
        }
        prevThreads
      })
    }

    // Add user message to chat display
    setPrevChats((prevChats) => [
      ...prevChats,
      {
        role: "user",
        content: currPrompt,
      },
    ]);

    try {
      const apiURL = threadId
        ? `http://localhost:3000/api/thread/${threadId}`
        : "http://localhost:3000/api/chat";
      const method = threadId ? "PATCH" : "POST";

      const options = {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: currPrompt,
        }),
      };

      const response = await fetch(apiURL, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // const contentType = response.headers.get("content-type");
      // if (!contentType || !contentType.includes("application/json")) {
      //   const text = await response.text();
      //   console.error("Received non-JSON response:", text);
      //   throw new Error("Received non-JSON response from server");
      // }

      const res = await response.json();

      if (!threadId && res._id) {
        setThreadId(res._id);
        getAllThreads();
        const aiReply = res.messages[res.messages.length - 1].content;
        setPrevChats((prevChats) => [
          ...prevChats,
          { role: "assistant", content: aiReply },
        ]);
        setReply(aiReply);
      } else if (res.reply) {
        setPrevChats((prev) => [
          ...prev,
          { role: "assistant", content: res.reply },
        ]);
        setReply(res.reply);
      }
    } catch (err) {
      console.log("Fetch error:", err);

      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        className="search-box"
        sx={{
          width: { xs: "100%", md: 700 },
          maxWidth: "100%",
          
          borderRadius: "25px",
          height: { xs: "3.5rem", md: "4rem" },
          margin: "0 auto",
          border: "#A9A9A9 solid 1px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <TextField
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          placeholder="Ask Anything"
          fullWidth
          id="fullWidth"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "none" },
            },

            "& .MuiInputBase-input": {
              fontSize: { xs: "1rem", md: "1.2rem" },
              marginLeft: { xs: "0.5", md: "1rem" },
              "&::placeholder": {
                color: "#BEBEBE",
                opacity: 1,
              },
            },
          }}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          {isListening ? (
          <MicOffIcon
            sx={{ color: "#ff4444", cursor: "pointer", fontSize: "1.8rem" }}
          ></MicOffIcon>
          ): (
          <MicIcon
            sx={{
              color: "#BEBEBE",
              cursor: "pointer",
              fontSize: "1.8rem",
              "&:hover": { color: "white" },
            }}  onClick={runVoiceRecognition}
          />
          )}
        </Box>
        <SendIcon
          onClick={getReply}
          fontSize="medium"
          className="send-btn"
          sx={{ margin: "2rem", cursor: "pointer" }}
        />
      </Box>
    </>
  );
}
