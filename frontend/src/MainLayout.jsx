import { useContext } from "react";
import { MyContext } from "./MyContext";
import { BeatLoader } from "react-spinners";
import Chat from "./Chat";
import Search from "./Search";
import Sidebar from "./Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import "./App.css";

export default function MainLayout(){
    const { isChatStarted, loading, setSidebarOpen } = useContext(MyContext);

    return (
        <>
            <button 
                className="menu-toggle" 
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
            >
                <MenuIcon />
            </button>
            <main
          className={`main-content ${
            isChatStarted ? "chat-mode" : "landing-mode"
          }`}
        >
          
          {!isChatStarted && <h1>Hi, how can I assist?</h1>}
          {isChatStarted && <Chat/>}

          {loading && (<div className="loader-container" style={{marginBottom : "5rem"}}>
            <BeatLoader color={"#ffffff"} loading={loading} ></BeatLoader>
          </div>)}
          
          
          <Search />
        </main>
        <Sidebar />
        </>
    )
}