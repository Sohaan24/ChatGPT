import { useState, useContext } from "react";
import { MyContext } from "./MyContext";
import {
  Box,
  TextField,
  Button,
  Typography,
  Modal,
  Alert,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#1e1e1e",
  border: "1px solid #444",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  color: "white",
  outline: "none",
};

export default function AuthModel({ open, handleClose }) {
  const { login, signup } = useContext(MyContext);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    setError("");
    let result;

    if (isLogin) {
      result = await login(email, password);
    } else {
      if (!name) return setError("Name is required");
      result = await signup(name, email, password);
    }

    if (result.success) {
      handleClose();
      setName("");
      setEmail("");
      setPassword("");
    } else {
      setError(result.msg);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" mb={3} fontWeight="bold" textAlign="center">
          {isLogin ? "Welcome back" : "Create Account"}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!isLogin && (
          <TextField
            fullWidth
            label="Full Name"
            variant="filled"
            sx={{
              bgcolor: "#303030",
              borderRadius: 1,
              mb: 2,
              input: { color: "white" },
            }}
            InputLabelProps={{ style: { color: "gray" } }}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        )}
        <TextField 
          fullWidth label="Email" variant="filled" 
          sx={{ bgcolor: "#303030", borderRadius: 1, mb: 2, input: { color: "white" } }} 
          InputLabelProps={{ style: { color: "gray" } }}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <TextField 
          fullWidth label="Password" type="password" variant="filled" 
          sx={{ bgcolor: "#303030", borderRadius: 1, mb: 2, input: { color: "white" } }} 
          InputLabelProps={{ style: { color: "gray" } }}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <Button 
          fullWidth variant="contained" 
          onClick={handleSubmit} 
          sx={{ mb: 2, py: 1.5, bgcolor: "white", color: "black", fontWeight: "bold", "&:hover": { bgcolor: "#f0f0f0" } }}
        >
          {isLogin ? "Log In" : "Sign Up"}
        </Button>

        <Typography 
            variant="body2" 
            sx={{ cursor: "pointer", color: "#8e8ea0", textAlign: "center", "&:hover":{color:"white"} }}
            onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
        </Typography>
      </Box>
    </Modal>
  );
}
