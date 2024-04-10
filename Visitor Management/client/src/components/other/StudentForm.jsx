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

function StudentForm() {
  const [branchOfStudy, setBranchOfStudy] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [address, setAddress] = useState("");
  const [rollNumber,setRollNumber] = useState("");
  const { setProfileUpdated } = useStateContext();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("branchOfStudy", branchOfStudy);
      formData.append("yearOfStudy", yearOfStudy);
      formData.append("address", address);
      formData.append("rollNumber",rollNumber);

      const response = await axios.post(request.studentform, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.status === 200) {
        alert("Values Inserted Successfully");
        setProfileUpdated(true);
        setBranchOfStudy("");
        setYearOfStudy("");
        setAddress("");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while inserting values");
    }
  };

  return (
    <div className="flex justify-center bg-auth_back">
      <div className="bg-auth_top rounded-lg shadow-lg px-10 py-16 mt-2 lg:w-2/5 lg:max-w-md w-full">
        <h1 className="text-4xl font-bold">Enter the following Details</h1>
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
                  id="rollNumber"
                  label="Roll Number"
                  name="rollNumber"
                  autoComplete="rollNumber"
                  autoFocus
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="branchOfStudy"
                  label="Branch of Study"
                  name="branchOfStudy"
                  autoComplete="branchOfStudy"
                  autoFocus
                  value={branchOfStudy}
                  onChange={(e) => setBranchOfStudy(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="yearOfStudy"
                  label="Year of Study"
                  type="text"
                  id="yearOfStudy"
                  autoComplete="yearOfStudy"
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
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

export default StudentForm;
