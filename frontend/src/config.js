

const config = {
  
  API_BASE_URL: window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://chatgpt-backend-o2ju.onrender.com" 
};

export default config;