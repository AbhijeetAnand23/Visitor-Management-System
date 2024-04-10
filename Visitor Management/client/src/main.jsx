import React, { useState } from "react";
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import App from './App'
import './index.css'

import { ContextProvider } from './contexts/ContextProvider';

function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    userType: "",
    imageUrl: "",
  });

  return (
    <React.StrictMode>
      <ContextProvider userData={userData} setUserData={setUserData} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ContextProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
