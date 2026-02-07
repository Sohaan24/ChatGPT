import { createContext, useState, useEffect } from "react";
import config from "./config";

export const MyContext = createContext();

export const MyProvider = ({children}) =>{
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prevChats, setPrevChats] = useState([]); // storing all the chats of the curr thread
  const [threadId, setThreadId] = useState(null);
  const [allThreads, setAllThreads] = useState([]);
  
  const[user, setUser] = useState(()=>{
    const savedUser = localStorage.getItem("user") ;
    return savedUser ? JSON.parse(savedUser) : null ;
  }) ;
  const[token, setToken] = useState(localStorage.getItem("token") || null) ;


  const signup = async(name, email, password)=>{
    try{
      const response = await fetch(`${config.API_BASE_URL}/api/auth/signup`, {
        method : "POST",
        headers : {"Content-Type" : "application/json"} ,
        body : JSON.stringify({name, email,password}),
      }) ;

      const data = await response.json() ;

      if(!response.ok){
        return {success : false , msg : data.msg || "Server Error"}
      }

      if(data.status === true){
        localStorage.setItem("token", data.token) ;
        localStorage.setItem("user", JSON.stringify(data.user)) ;
        setToken(data.token) ;
        setUser(data.user) ;
        return {success : true}
      }else{
        return { success: false, msg: data.msg };
      }
    }catch(error){
      console.log(error) ;
      return {success : false, msg : "Server Error"} ;
    }
  };

  const login = async(email, password)=>{
    try{
      const response = await fetch(`${config.API_BASE_URL}/api/auth/login`,{
        method :"POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({email, password}),
      }) ;
      const data = await response.json() ;

      if(!response.ok){
        return {success : false , msg : data.msg || "Server Error"}
      }

      if(data.status === true || data.success === true){
        localStorage.setItem("token",data.token) ;
         localStorage.setItem("user", JSON.stringify(data.user)) ;
        setUser(data.user) ;
        setToken(data.token) ;
        getAllThreads(data.token) ;
        return({success : true}) ;

      }else{
        return{success : false, msg : data.msg || "Login Failed"} ;
      }
      
    }catch(error){
      console.log(error) ;
      return{success : false, msg : "Server Error"} ;
    }
  }

  const logout = async()=>{
    localStorage.removeItem("token") ;
    setToken(null) ;
    setUser(null) ;
    setPrevChats([]) ;
    setAllThreads([]) ;
    setThreadId(null) ;
    setIsChatStarted(false) ;
    localStorage.removeItem("user") ;
  }


  const getAllThreads = async (currentToken = null) => {
    try {
      const activeToken = currentToken || localStorage.getItem("token") ;
      if (!activeToken) return;
      const response = await fetch(`${config.API_BASE_URL}/api/allthreads`,{
        method : "GET",
        headers :{
          "Content-Type" : "application/json",
          "auth-token" : activeToken,
        },
      });
      const res = await response.json();

      if(Array.isArray(res)){
        const filterData = res.map((thread) => ({
        threadId: thread._id,
        title: thread.title,
      }));
      setAllThreads(filterData) ;
      }
     
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token") ;
    if(savedToken){
      getAllThreads();
    } 
  }, []);

 

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
    token,
    login,
    logout,
    signup,
    user,
  };

  
  return(
    <MyContext.Provider value={providerValues}>
        {children}
    </MyContext.Provider>
  );
}
