import "./sidebar.css";
import * as React from "react";

import { useContext } from "react";
import { MyContext } from "./MyContext";
 


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
  
} from "@mui/material";
import {
  Logout,
  EditNote,
  Delete,
  LightMode,
  DarkMode
} from "@mui/icons-material";

function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const {changeTheme, isLightMode} = useContext(MyContext);
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
            <Avatar sx={{bgcolor: "#5d5d5d", width: 30, height: 30, mr : 2 }}>S</Avatar> 
            <Typography variant="body3" color="white" fontSize="1.2rem">Sohan</Typography>
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
              bgcolor : isLightMode === "light"? "#ffffff" : "#2f2f2f" ,
              color : isLightMode === "light"?"black" : "white" ,
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: -5,
              width : "19rem",

              "& .MuiAvatar-root": {
                width: 30,
                height: 30,
                ml: -0.5,
                mr: 1,
                bgcolor: isLightMode === "light" ? "#e0e0e0" : "#5d5d5d",
                color: isLightMode === "light" ? "black" : "white"
              }
              },
        }}
        transformOrigin={{ horizontal: "left", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "left", vertical: "top" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Email
        </MenuItem>
       
        <Divider sx={{bgcolor : "gray"}} />
        <MenuItem onClick={()=>{
          handleClose() ;
          changeTheme() ;
        }}>
          <ListItemIcon>
            {isLightMode === "light" ? <DarkMode fontSize="small"/> : <LightMode fontSize="small" />}
          </ListItemIcon>
          Theme
        </MenuItem>
        <MenuItem onClick={handleClose}>
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
    
  } = useContext(MyContext);

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
      const response = await fetch(`http://localhost:3000/api/thread/${id}`);
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
      const response = await fetch(`http://localhost:3000/api/delete/${id}`, {
        method: "DELETE",
      });
      const res = await response.json();
      console.log(res);

      getAllThreads();
      if (id === threadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
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
        {allThreads?.map((thread, idx) => (
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
      </section>
      <section className="profile" >
        <hr></hr>
        <AccountMenu/>
      </section>
    </div>
  );
}
