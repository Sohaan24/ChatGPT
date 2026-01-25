import "./App.css";
import { MyContext, MyProvider } from "./MyContext"; 
import MainLayout from "./MainLayout";
import { useContext } from "react";


const AppContent = () => {
  
  const { isLightMode } = useContext(MyContext); 

  return (

    <div className={`app-container ${isLightMode === "light" ? "light-theme" : ""}`}>
      <MainLayout />
    </div>
  );
};

function App() {
 
  return (
    <>
      
      <MyProvider>
        <AppContent/>
      </MyProvider>
     
    </>
  );
}

export default App;
