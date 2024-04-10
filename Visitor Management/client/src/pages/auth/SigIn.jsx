import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import axios from "../../services/api";
import request from "../../services/requests";

import UserTypeSelect from "../../components/UserTypeSelect";

const defaultTheme = createTheme();

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [userType, setUserType] = useState("");
  const [otp, setOtp] = useState("");
  const [myotp, setMyOtp] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const navigate = useNavigate();

  async function sendOtp() {
    let datas = JSON.stringify({
      email: email,
    });

    try {
      const response = await axios.post(request.otp, datas, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      console.log(data.otp);
      setOtp(data.otp);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleSendOTP = async (e) => {
    e.preventDefault();
    sendOtp();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("name", name);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("image", file);
      formData.append("userType", userType);

      const response = await axios.post(request.signup, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 && myotp == otp) {
        console.log("Signup successful!");
        navigate("/");
      } else {
        console.error("Signup failed:", response.data.message);
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
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
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="Name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

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
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

                <div className="mt-4">
                  <UserTypeSelect
                    userType={userType}
                    setUserType={setUserType}
                  />
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendOTP}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Send OTP
                </Button>

                <TextField
                  margin="normal"
                  fullWidth
                  id="otp"
                  label="OTP"
                  name="otp"
                  autoFocus
                  value={myotp}
                  onChange={(e) => setMyOtp(e.target.value)}
                />

                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Upload file
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                      setSelectedFileName(e.target.files[0].name);
                    }}
                  />
                </Button>
                {selectedFileName && (
                  <Typography variant="body1" gutterBottom>
                    Selected file: {selectedFileName}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Sign In
                </Button>
                <p className="text-neutral-500 mt-4">
                  Already have an account?
                  <a
                    href="/"
                    className="text-blue-400 font-semibold text-lg ml-1 hover:underline cursor-pointer"
                  >
                    LogIn
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

export default SignIn;
