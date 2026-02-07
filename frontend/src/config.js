

const config = {
  
  API_BASE_URL: window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://your-backend-app-name.onrender.com" 
};

export default config;