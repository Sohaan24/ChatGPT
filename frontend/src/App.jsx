import "./App.css";
import { MyProvider } from "./MyContext"; 
import MainLayout from "./MainLayout";
import { Toaster } from 'react-hot-toast';

const AppContent = () => {

  return (
    <div>
      <MainLayout />
    </div>
  );
};

function App() {
 
  return (
    <>
      <MyProvider>
        <AppContent/>
        <Toaster position="top-center"/>
      </MyProvider>
     
    </>
  );
}

export default App;
