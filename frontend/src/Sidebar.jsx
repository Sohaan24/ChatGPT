import "./sidebar.css";
import * as React from "react";
import { useContext, useState } from "react";
import { MyContext } from "./MyContext";
import AuthModal from "./AuthModel";
import toast from 'react-hot-toast';
import config from "./config" ;
 

import {
  Box,
  Avatar,
  Menu,
  MenuList,
  ListItemIcon,
  Divider,
  IconButton,
  Typography,
  Tooltip,
  MenuItem,
  Button,
  
} from "@mui/material";
import {
  Logout,
  EditNote,
  Delete,
  LightMode,
  DarkMode,
  Login,
} from "@mui/icons-material";

function AccountMenu() {
  const{logout, user} = useContext(MyContext) ;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getInitial = (name)=>{
    return name ? name.charAt(0).toUpperCase() : "?" ;
  }
  const getFirstName = (name)=>{
    const arr = name.split(" ") ;
    return arr[0] ;
  }
  
  return (
    <React.Fragment>
      <Box sx={{ display: "flex",gap : 1.5, padding: "10px 15px",borderRadius: "10px", transition: "0.3s", "&:hover":{bgcolor: "#3e3e3e"}, alignItems: "center", width: "100%"  }} onClick={handleClick}>
        
        <Tooltip title="Account settings">
          <IconButton
            size="small"
            sx={{ ml: 0, mr : 1 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{bgcolor: "#5d5d5d", width: 30, height: 30, mr : 2 }}>{getInitial(user?.name)}</Avatar> 
            <Typography variant="body1" fontSize="1.2rem" sx={{color : "white"}}>{getFirstName(user?.name) || "User"}</Typography>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          
            elevation: 0,
            sx: {
              bgcolor : "#2f2f2f" ,
              color : "white"  ,
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: -5,
              width : "19rem",

              "& .MuiAvatar-root": {
                width: 30,
                height: 30,
                ml: -0.5,
                mr: 1,
                bgcolor: "#5d5d5d",
                color: "white"
              }
              },
        }}
        transformOrigin={{ horizontal: "left", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "left", vertical: "top" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> {user?.email || ""}
        </MenuItem>
       
        <Divider sx={{bgcolor : "gray"}} />
        <MenuItem onClick={()=>{
          handleClose() ;
          
        }}>
          
        </MenuItem>
        <MenuItem onClick={()=>{
          handleClose() ;
          logout() ;
          
        }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{color: "white"}} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default function Sidebar() {
  const {
    allThreads,

    setIsChatStarted,
    setPrompt,
    setReply,
    setPrevChats,
    threadId,
    setThreadId,
    getAllThreads,
    token,
  } = useContext(MyContext);

  const [openModal, setOpenModal ] = useState(false) ;
  const createNewChat = () => {
    setIsChatStarted(false);
    setPrompt("");
    setReply(null);
    setPrevChats([]);
    setThreadId(null);
  };

  const getThread = async (id) => {
    setThreadId(id);
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/thread/${id}`,{
        method : "GET",
        headers :{
          "Content-Type" : "application/json",
          "auth-token" : token,
        },
      });
      const res = await response.json();
      setPrevChats(res);
      setIsChatStarted(true);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (id) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/delete/${id}`, {
        method: "DELETE",
        headers :{
          "Content-Type" : "application/json",
          "auth-token" : token ,
        }
      });
      const res = await response.json();
      
      if(!response.ok){
        toast.error(res.message || "failed to delete" ) ;
        return ;
      }

      toast.success("Chat deleted successfully");

      getAllThreads();
      if (id === threadId) {
        createNewChat();
      }
    } catch (err) {
      toast.error("Network Error");
    }
  };

  return (
    <div className="sidebar">
      <section className="main">
        <img src="src/assets/chatgpt.webp" className="logo"></img>
        <button className="icons" onClick={createNewChat}>
          <EditNote /> New Chat<br></br>
        </button>
      </section>

      <section className="chats">
        <h4>Chats</h4>
        {token && allThreads ?.map((thread, idx) => (
          <li key={idx} onClick={() => getThread(thread.threadId)}>
            {thread.title}{" "}
            <IconButton>
              <Delete
                fontSize="medium"
                className="del-btn"
                onClick={(e) => {
                  e.stopPropagation(); // stop event bubbling ;
                  deleteThread(thread.threadId);
                }}
              ></Delete>
            </IconButton>
          </li>
        ))}
        {!token ? <p style={{fontSize : "1.2rem", padding : "10px",}}>Login to save Chats</p>:""}
      </section>
      <section className="profile" >
      <hr></hr>
      {token ? (
        
        <AccountMenu/>
      ):
      (
        <Box sx={{padding :"10px"}}>
          <Button variant="outline" startIcon={<Login/>}
          sx={{
            color :"white", borderColor :"#555","&:hover":{borderColor : "white"}
          }}
          onClick = {()=> setOpenModal(true)}>
          Log In
          </Button>
        </Box>
      )
      }
       </section>
       <AuthModal open={openModal} handleClose={() => setOpenModal(false)} />
    </div>
  );
}
