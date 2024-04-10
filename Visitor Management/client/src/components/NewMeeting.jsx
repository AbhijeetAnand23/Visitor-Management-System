import React, { useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Header,SearchBar} from "../components";

import axios from "../services/api";
import request from "../services/requests";

const defaultTheme = createTheme();

function NewMeeting() {
  const [receiverName, setReceiverName] = useState("");
  const [meetingDescription, setMeetingDescription] = useState("");
  const [selectedAttendant, setSelectedAttendant] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("receiverName", receiverName);
      formData.append("meetingDescription", meetingDescription);

      const response = await axios.post(request.meetingRequests, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.status === 200) {
        alert("Meeting request created successfully");
        setReceiverName("");
        setMeetingDescription("");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating meeting request");
    }
  };

  // Update receiverName when an attendant is selected
  const handleSelectAttendant = (attendant) => {
    setSelectedAttendant(attendant);
    setReceiverName(attendant);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Meeting" title="New Meeting" />
      <div className="flex justify-center bg-auth_back">
        <div className="bg-auth_top rounded-lg shadow-lg px-10 py-16 mt-2 lg:w-2/5 lg:max-w-md w-full">
          <h1 className="text-4xl font-bold">Book a meeting</h1>
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
                  <SearchBar
                    onSelectAttendant={handleSelectAttendant} // Update the handler function
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="receiverName"
                    label="Receiver Name"
                    name="receiverName"
                    autoComplete="receiverName"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="meetingDescription"
                    label="Meeting Description"
                    id="meetingDescription"
                    multiline
                    rows={4}
                    autoComplete="meetingDescription"
                    value={meetingDescription}
                    onChange={(e) => setMeetingDescription(e.target.value)}
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
    </div>
  );
}

export default NewMeeting;
