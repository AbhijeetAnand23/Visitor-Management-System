import React, { useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import axios from "../../services/api";
import request from "../../services/requests";

import { useStateContext } from "../../contexts/ContextProvider";

const defaultTheme = createTheme();

function FacultyForm() {
  const [profession, setProfession] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const { setProfileUpdated } = useStateContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("profession", profession);
      formData.append("address", address);
      formData.append("age", age);
      const response = await axios.post(request.visitorform, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.status === 200) {
        alert("Values Inserted Successfully");
        setProfileUpdated(true);
        setProfession("");
        setAddress("");
        setAge("");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while inserting values");
    }
  };

  return (
    <div className="flex justify-center bg-auth_back">
      <div className="bg-auth_top rounded-lg shadow-lg px-10 py-16 mt-2 lg:w-2/5 lg:max-w-md w-full">
        <h1 className="text-4xl font-bold">Enter the following details</h1>
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
                  name="age"
                  label="Age"
                  type="number"
                  id="age"
                  autoComplete="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="profession"
                  label="Profession"
                  type="text"
                  id="profession"
                  autoComplete="profession"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="address"
                  label="Address"
                  type="text"
                  id="address"
                  autoComplete="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 py-3 text-white rounded-lg w-full mt-6 hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </div>
    </div>
  );
}

export default FacultyForm;
