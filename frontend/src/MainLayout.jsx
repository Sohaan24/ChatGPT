import { useContext } from "react";
import { MyContext } from "./MyContext";
import { BeatLoader } from "react-spinners";
import Chat from "./Chat";
import Search from "./Search";
import Sidebar from "./Sidebar";
import "./App.css";

export default function MainLayout(){
    const { isChatStarted, loading } = useContext(MyContext);

    return (
        <>
            <main
          className={`main-content ${
            isChatStarted ? "chat-mode" : "landing-mode"
          }`}
        >
          
          {!isChatStarted && <h1>Hi, how can I assist?</h1>}
          <div className="loader-container">
            <BeatLoader color="white" loading={loading}></BeatLoader>
          </div>
          {isChatStarted && <Chat/>}
          <Search />
        </main>
        <Sidebar />
        </>
    )
}