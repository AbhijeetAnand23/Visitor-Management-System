import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";

import axios from "../../services/api";
import request from "../../services/requests";

import { useStateContext } from "../../contexts/ContextProvider";

const defaultTheme = createTheme();

function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { updateAuthStatus } = useStateContext();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(request.login, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status === 200) {
        console.log("Login successful!");
        localStorage.setItem("token", response.data.token);
        updateAuthStatus(true);
        navigate("/homescreen");
      } else {
        console.error("Login Failed:", response.data.message);
      }
    } catch (error) {
      console.error("Login Failed:", error);
    }

    setUsername("");
    setPassword("");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-auth_back">
      <div className="bg-auth_top rounded-lg shadow-lg px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md w-full">
        <h1 className="text-4xl font-bold">Welcome to Visitor Management</h1>
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 py-3 text-white rounded-lg w-full mt-6 hover:bg-blue-700 transition"
                >
                  Login
                </button>
                {/* <div className="flex flex-row items-center gap-4 mt-4 justify-center">
                  <div
                    // onClick={() => signIn('google', {callbackUrl: '/'})}
                    className=" w-10 h-10 bg-auth_back rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition "
                  >
                    <FcGoogle size={30} />
                  </div>

                  <div
                    // onClick={() => signIn('github', {callbackUrl: '/'})}
                    className=" w-10 h-10 bg-auth_back rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition  "
                  >
                    <FaGithub size={30} />
                  </div>
                </div> */}
                <p className="text-neutral-500 mt-4">
                  Don't have an account?
                  <a
                    href="/signin"
                    className="text-blue-400 font-semibold text-lg ml-1 hover:underline cursor-pointer"
                  >
                    Register
                  </a>
                </p>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </div>
    </div>
  );
}

export default LogIn;
