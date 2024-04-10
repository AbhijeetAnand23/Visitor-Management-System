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
  const [academicTitle, setAcademicTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [officeHoursStart, setOfficeHoursStart] = useState("");
  const [officeHoursEnd, setOfficeHoursEnd] = useState("");
  const { setProfileUpdated } = useStateContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("academicTitle", academicTitle);
      formData.append("department", department);
      formData.append("officeLocation", officeLocation);
      formData.append("officeHoursStart", officeHoursStart);
      formData.append("officeHoursEnd", officeHoursEnd);

      const response = await axios.post(request.facultyform, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.status === 200) {
        alert("Values Inserted Successfully");
        setProfileUpdated(true);
        setAcademicTitle("");
        setDepartment("");
        setOfficeLocation("");
        setOfficeHoursStart("");
        setOfficeHoursEnd("");
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
                  id="academicTitle"
                  label="Academic Title"
                  name="academicTitle"
                  autoComplete="academicTitle"
                  value={academicTitle}
                  onChange={(e) => setAcademicTitle(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="department"
                  label="Department"
                  type="text"
                  id="department"
                  autoComplete="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="officeLocation"
                  label="Office Location"
                  type="text"
                  id="officeLocation"
                  autoComplete="officeLocation"
                  value={officeLocation}
                  onChange={(e) => setOfficeLocation(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="officeHoursStart"
                  label="Office Hours Start"
                  type="text"
                  id="officeHoursStart"
                  autoComplete="officeHoursStart"
                  value={officeHoursStart}
                  onChange={(e) => setOfficeHoursStart(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="officeHoursEnd"
                  label="Office Hours End"
                  type="text"
                  id="officeHoursEnd"
                  autoComplete="officeHoursEnd"
                  value={officeHoursEnd}
                  onChange={(e) => setOfficeHoursEnd(e.target.value)}
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
