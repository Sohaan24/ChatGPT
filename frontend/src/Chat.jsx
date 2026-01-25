import "./Chat.css" ;
import {useContext, useState, useEffect} from "react" ;
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown" ;
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

function Chat(){
    const {prevChats, reply} = useContext(MyContext) ;
    const [typedText, setTypedText] = useState("") ;

    useEffect(()=>{

        if(reply === null){
          setTypedText(null) ;
          return ;
        }
        if (!prevChats || prevChats.length === 0 ) return ;
        
        const lastMessage = prevChats[prevChats.length -1] ;

        if(lastMessage.role === "user"){
            setTypedText(null) ;
            return ;
        }

        const fullText = lastMessage.content || "" ;
        const words = fullText.split(" ") ;

        let i = 0 ;
        setTypedText("") ;

        const interval = setInterval(()=>{
            if(i < words.length){
                const nextWord = words[i] ;
                if(nextWord !== undefined){
                  setTypedText((prev)=> prev + (i === 0 ? "" : " ") + nextWord) ;
                  i++ ;
                }

            }else{
                clearInterval(interval) ;
            }
        }, 40) ;

        return ()=> clearInterval(interval) ;

        
    },[prevChats, reply]) ;

    return (
  <>
    <div className="thread-chat">
      {prevChats?.map((chat, idx) => {
        
        const isLastMessage = idx === prevChats.length - 1;
        const isAi = chat.role !== "user";
        
        const contentToShow = (isLastMessage && isAi && reply) 
                              ? typedText || ""
                              : chat.content;

        return (
          <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
            {chat.role === "user" ? (
          
              <p className="userMessage">{contentToShow}</p>
            ) : (
            
              <div className="gptMessages">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {contentToShow}
                </ReactMarkdown>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </>
);
}

export default Chat ;