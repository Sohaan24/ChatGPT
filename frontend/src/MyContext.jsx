import { createContext, useState, useEffect } from "react";


export const MyContext = createContext();

export const MyProvider = ({children}) =>{
    const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prevChats, setPrevChats] = useState([]); // storing all the chats of the curr thread
  const [threadId, setThreadId] = useState(null);
  const [allThreads, setAllThreads] = useState([]);
  const[isLightMode, setIsLightMode] = useState("") ;


  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/allthreads");
      const res = await response.json();
      const filterData = res.map((thread) => ({
        threadId: thread._id,
        title: thread.title,
      }));

      setAllThreads(filterData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllThreads();
  }, []);

  const changeTheme = ()=>{
    setIsLightMode(prev =>prev === "light" ? "" : "light") ;
  }


  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    setIsChatStarted,
    setLoading,
    prevChats,
    setPrevChats,
    threadId,
    setThreadId,
    allThreads,
    setAllThreads,
    getAllThreads,
    loading,
    isChatStarted,
    isLightMode,
    setIsLightMode,
    changeTheme
  };

  
  return(
    <MyContext.Provider value={providerValues}>
        {children}
    </MyContext.Provider>
  );
}
