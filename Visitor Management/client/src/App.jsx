import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import LinearProgress from "@mui/material/LinearProgress";

import { FiSettings } from "react-icons/fi";

import { Navbar, Sidebar, ThemeSettings, NewMeeting } from "./components";
import {
  HomeScreen,
  AcceptedRequests,
  MeetingRequests,
  Calendar,
  Form,
  LogIn,
  SignIn,
  Error,
} from "./pages";

import { PopUp } from "./components";

import { useStateContext } from "./contexts/ContextProvider";

import "./App.css";

const App = () => {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
    isLoggedIn,
    userData,
    setIsClicked,
  } = useStateContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LinearProgress />;
  }

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/signin" element={<SignIn />} />

        <Route path="*" element={<Error />} />
      </Routes>
    );
  }

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
          <button
            type="button"
            className="text-3xl p-3 hover:bg-light-gray text-white"
            onClick={() => setThemeSettings(true)}
            style={{ background: currentColor, borderRadius: "50%" }}
          >
            <FiSettings />
          </button>
        </div>
        <div
          className={`dark:bg-secondary-dark-bg ${
            activeMenu ? "w-72 fixed sidebar bg-white" : "w-0"
          }`}
        >
          {activeMenu && <Sidebar />}
        </div>

        <div
          className={
            activeMenu
              ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
              : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
          }
        >
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>
          <div>
            {themeSettings && <ThemeSettings />}

            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/homescreen" element={<HomeScreen />} />

              <Route path="/acceptedrequests" element={<AcceptedRequests />} />
              <Route path="/meetingrequests" element={<MeetingRequests />} />

              <Route path="/calendar" element={<Calendar />} />

              <Route path="newmeeting" element={<NewMeeting />} />
              <Route path="/form" element={<Form />} />

              <Route path="*" element={<Error />} />
            </Routes>
          </div>
          {userData.userType === "faculty" && <PopUp />}
        </div>
      </div>
    </div>
  );
};

export default App;
